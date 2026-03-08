from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import inspect, text
from typing import Optional
import os

from database import engine, get_db, Base
from models import User, UserSkill, Project, Message, Application, Announcement, Devlog, DevlogReaction, Notification
from schemas import (
    UserCreate, UserUpdate, UserResponse, ProjectCreate, ProjectUpdate, ProjectResponse,
    MessageCreate, MessageResponse, ApplicationCreate, ApplicationResponse,
    AnnouncementCreate, AnnouncementResponse, DevlogCreate, DevlogResponse,
    ReactionCreate, ReactionCount, LeaderboardEntry, LoginRequest, TokenResponse,
    NotificationResponse, CompatibilityResponse, EndorsementCreate, EndorsementResponse,
)
from auth import hash_password, verify_password, create_access_token, get_current_user, get_optional_user
from github_service import fetch_github_profile
import crud

# Create tables
Base.metadata.create_all(bind=engine)

# Ensure columns added after initial creation are present
def _migrate_columns():
    try:
        inspector = inspect(engine)
        with engine.begin() as conn:
            if inspector.has_table("projects"):
                cols = [c['name'] for c in inspector.get_columns("projects")]
                if 'demo_url' not in cols:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN demo_url VARCHAR DEFAULT ''"))
                if 'github_repo_url' not in cols:
                    conn.execute(text("ALTER TABLE projects ADD COLUMN github_repo_url VARCHAR DEFAULT ''"))
                    
            if inspector.has_table("users"):
                user_cols = [c['name'] for c in inspector.get_columns("users")]
                if 'is_verified' not in user_cols:
                    db_url = os.getenv("DATABASE_URL", "")
                    if "postgres" in db_url:
                        conn.execute(text("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE"))
                    else:
                        conn.execute(text("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0"))
    except Exception as e:
        print("Migration error:", e)

_migrate_columns()

def auto_seed():
    from seed import seed, seed_devlogs_safe
    from database import SessionLocal
    from models import User, Devlog
    
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            print("⚡ Database empty — auto-seeding...")
            seed()
        elif db.query(Devlog).count() == 0:
            print("⚡ Devlogs empty — inserting default devlogs safely...")
            seed_devlogs_safe(db)
    except Exception as e:
        print(f"⚠️ Seed error (non-fatal): {e}")
    finally:
        db.close()

auto_seed()

app = FastAPI(title="Dev-Match API", version="2.0.0")

# CORS — configurable via CORS_ORIGINS env var (comma-separated)
_default_origins = "https://dev-match-tau.vercel.app,http://localhost:5173,http://localhost:3000"
origins = [o.strip() for o in os.getenv("CORS_ORIGINS", _default_origins).split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Auth ──────────────────────────────────────────────────

@app.post("/api/auth/register", response_model=TokenResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    email = user.email.strip().lower()
    if not email.endswith("@slrtce.in"):
        raise HTTPException(status_code=400, detail="Only @slrtce.in email addresses are allowed.")
        
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = crud.create_user(db, user)
    token = create_access_token(db_user.id)
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(db_user),
    )


@app.post("/api/auth/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    if not email.endswith("@slrtce.in"):
        raise HTTPException(status_code=401, detail="Only @slrtce.in email addresses are allowed.")

    user = db.query(User).filter(User.email == email).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ── Legacy register endpoint (backward compat) ───────────

@app.post("/api/users", response_model=UserResponse)
def register_user_legacy(user: UserCreate, db: Session = Depends(get_db)):
    email = user.email.strip().lower()
    if not email.endswith("@slrtce.in"):
        raise HTTPException(status_code=400, detail="Only @slrtce.in email addresses are allowed.")

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)


# ── Users ─────────────────────────────────────────────────

@app.get("/api/users", response_model=list[UserResponse])
def list_users(
    skill: Optional[str] = Query(None),
    semester: Optional[int] = Query(None),
    department: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    availability: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return crud.get_users(db, skill=skill, semester=semester, department=department, search=search, availability=availability)


@app.get("/api/users/by-email/{email}", response_model=UserResponse)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email.strip().lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/api/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.put("/api/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="You can only edit your own profile")
    return crud.update_user(db, current_user, data)


@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="You can only delete your own account")
    db.delete(current_user)
    db.commit()
    return {"detail": "Account deleted"}


@app.get("/api/users/{user_id}/projects", response_model=list[ProjectResponse])
def get_user_projects(user_id: int, db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.owner_id == user_id).order_by(Project.created_at.desc()).all()


@app.get("/api/users/{user_id}/received-applications")
def get_received_applications(user_id: int, db: Session = Depends(get_db)):
    projects = db.query(Project).filter(Project.owner_id == user_id).all()
    project_ids = [p.id for p in projects]
    if not project_ids:
        return []
    apps = db.query(Application).filter(Application.project_id.in_(project_ids)).order_by(Application.created_at.desc()).all()
    return [
        {
            "id": a.id, "status": a.status, "message": a.message,
            "created_at": a.created_at,
            "project": {"id": a.project.id, "title": a.project.title},
            "applicant": {"id": a.applicant.id, "name": a.applicant.name, "avatar_url": a.applicant.avatar_url or ""},
        }
        for a in apps
    ]


@app.get("/api/users/{user_id}/my-applications")
def get_my_applications(user_id: int, db: Session = Depends(get_db)):
    apps = db.query(Application).filter(Application.applicant_id == user_id).order_by(Application.created_at.desc()).all()
    return [
        {
            "id": a.id, "status": a.status, "message": a.message,
            "created_at": a.created_at,
            "project": {"id": a.project.id, "title": a.project.title},
        }
        for a in apps
    ]


# ── Compatibility ────────────────────────────────────────

@app.get("/api/users/{user_id}/compatibility", response_model=CompatibilityResponse)
def get_compatibility(user_id: int, with_user: int = Query(...), db: Session = Depends(get_db)):
    return crud.get_compatibility(db, with_user, user_id)


# ── Projects ─────────────────────────────────────────────

@app.post("/api/projects", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project.owner_id = current_user.id
    return crud.create_project(db, project)


@app.get("/api/projects", response_model=list[ProjectResponse])
def list_projects(
    skill: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return crud.get_projects(db, skill=skill, status=status, search=search)


@app.get("/api/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.put("/api/projects/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own projects")
    return crud.update_project(db, project, data)


@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own projects")
    crud.delete_project(db, project)
    return {"detail": "Project deleted"}


# ── Skills ────────────────────────────────────────────────

@app.get("/api/skills")
def list_skills(db: Session = Depends(get_db)):
    return crud.get_all_skills(db)


# ── Stats ─────────────────────────────────────────────────

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    return {
        "total_developers": db.query(User).count(),
        "total_projects": db.query(Project).count(),
        "total_skills": db.query(UserSkill.skill_name).distinct().count(),
        "open_projects": db.query(Project).filter(Project.status == "open").count(),
    }


@app.get("/api/stats/skills")
def get_skill_trends(db: Session = Depends(get_db)):
    from sqlalchemy import func
    rows = (
        db.query(UserSkill.skill_name, func.count(UserSkill.id).label("count"))
        .group_by(UserSkill.skill_name)
        .order_by(func.count(UserSkill.id).desc())
        .limit(15)
        .all()
    )
    dept_rows = (
        db.query(User.department, UserSkill.skill_name, func.count(UserSkill.id).label("count"))
        .join(UserSkill, User.id == UserSkill.user_id)
        .group_by(User.department, UserSkill.skill_name)
        .order_by(func.count(UserSkill.id).desc())
        .all()
    )
    by_dept = {}
    for dept, skill, cnt in dept_rows:
        by_dept.setdefault(dept, []).append({"skill": skill, "count": cnt})
    return {
        "top_skills": [{"skill": s, "count": c} for s, c in rows],
        "by_department": by_dept,
    }


# ── Messages ───────────────────────────────────────

@app.post("/api/messages", response_model=MessageResponse)
def send_message(msg: MessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    msg.sender_id = current_user.id
    if not crud.get_user(db, msg.receiver_id):
        raise HTTPException(status_code=404, detail="Receiver not found")
    if msg.sender_id == msg.receiver_id:
        raise HTTPException(status_code=400, detail="Cannot message yourself")
    result = crud.create_message(db, msg)
    # Create notification for receiver
    sender = crud.get_user(db, msg.sender_id)
    crud.create_notification(
        db, type="message", from_user_id=msg.sender_id, to_user_id=msg.receiver_id,
        content=f"{sender.name} sent you a message",
        link=f"/profile/{msg.sender_id}",
    )
    return result


@app.get("/api/messages/{user_id}", response_model=list[MessageResponse])
def get_user_messages(user_id: int, db: Session = Depends(get_db)):
    return crud.get_messages_for_user(db, user_id)


@app.get("/api/messages/{user1_id}/{user2_id}", response_model=list[MessageResponse])
def get_conversation(user1_id: int, user2_id: int, db: Session = Depends(get_db)):
    return crud.get_messages_between(db, user1_id, user2_id)


# ── GitHub ─────────────────────────────────────────────

@app.get("/api/github/{username}")
async def get_github_profile(username: str):
    result = await fetch_github_profile(username)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

import httpx

@app.post("/api/github/verify")
async def verify_github_account(code: str = Query(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")

    async with httpx.AsyncClient() as client:
        # 1. Exchange OAuth code for access token
        token_resp = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code
            },
            headers={"Accept": "application/json"}
        )
        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            # Check if the error is due to a reused code, and if the user is already verified
            error = token_data.get("error")
            if error == "bad_verification_code" and current_user.is_verified:
                # The code was already used (likely React Strict Mode double-firing), but user is verified anyway
                return {"status": "success", "user": UserResponse.model_validate(current_user)}
                
            raise HTTPException(status_code=400, detail="Invalid OAuth code or code already used")

        # 2. Get user emails from GitHub
        emails_resp = await client.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        emails = emails_resp.json()
        
        # Verify one of the authenticated GitHub emails matches @slrtce.in
        has_slrtce_email = any(e.get("email", "").endswith("@slrtce.in") and e.get("verified") for e in emails)
        
        if not has_slrtce_email:
            raise HTTPException(status_code=403, detail="Your GitHub account does not have a verified @slrtce.in email. Please add your college email to your GitHub profile and try again.")
            
        # 3. Get the GitHub profile username
        user_resp = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        github_user = user_resp.json()
        github_username = github_user.get("login")
        
        if not github_username:
            raise HTTPException(status_code=400, detail="Could not retrieve GitHub username")
            
        # 4. Save to database: mark verified and securely store the linked username
        current_user.is_verified = True
        current_user.github_username = github_username
        current_user.github_url = github_user.get("html_url", "")
        if not current_user.avatar_url:
            current_user.avatar_url = github_user.get("avatar_url", "")
            
        db.commit()
        db.refresh(current_user)
        
        return {"status": "success", "user": UserResponse.model_validate(current_user)}


# ── Applications ──────────────────────────────────────────

@app.post("/api/projects/{project_id}/apply", response_model=ApplicationResponse)
def apply_to_project(project_id: int, app: ApplicationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    app.applicant_id = current_user.id
    app.project_id = project_id
    result = crud.create_application(db, app)
    # Notify project owner
    applicant = crud.get_user(db, app.applicant_id)
    crud.create_notification(
        db, type="application", from_user_id=app.applicant_id, to_user_id=project.owner_id,
        content=f"{applicant.name} applied to '{project.title}'",
        link=f"/dashboard",
    )
    return result


@app.get("/api/projects/{project_id}/applications", response_model=list[ApplicationResponse])
def get_project_applications(project_id: int, db: Session = Depends(get_db)):
    return crud.get_applications_for_project(db, project_id)


@app.get("/api/projects/{project_id}/application-count")
def get_application_count(project_id: int, db: Session = Depends(get_db)):
    return {"count": crud.get_application_count(db, project_id)}


@app.patch("/api/applications/{app_id}")
def update_application(app_id: int, status: str = Query(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if status not in ("accepted", "rejected"):
        raise HTTPException(status_code=400, detail="Status must be 'accepted' or 'rejected'")
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    project = crud.get_project(db, app.project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can accept/reject applications")
    result = crud.update_application_status(db, app_id, status)
    # Notify applicant
    project = crud.get_project(db, app.project_id)
    crud.create_notification(
        db, type=status, from_user_id=project.owner_id, to_user_id=app.applicant_id,
        content=f"Your application to '{project.title}' was {status}",
        link=f"/dashboard",
    )
    return {"status": "updated"}


# ── Announcements ─────────────────────────────────────────

@app.post("/api/announcements", response_model=AnnouncementResponse)
def create_announcement(ann: AnnouncementCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ann.author_id = current_user.id
    return crud.create_announcement(db, ann)


@app.get("/api/announcements", response_model=list[AnnouncementResponse])
def list_announcements(tag: Optional[str] = Query(None), db: Session = Depends(get_db)):
    return crud.get_announcements(db, tag=tag)


# ── Devlogs ───────────────────────────────────────────────

@app.post("/api/devlogs", response_model=DevlogResponse)
def create_devlog(devlog: DevlogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    devlog.author_id = current_user.id
    if devlog.project_id and not crud.get_project(db, devlog.project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.create_devlog(db, devlog)


@app.get("/api/devlogs")
def list_devlogs(limit: int = Query(50, le=100), db: Session = Depends(get_db)):
    devlogs = crud.get_devlogs(db, limit=limit)
    results = []
    for d in devlogs:
        counts = crud.get_reaction_counts(db, d.id)
        reaction_counts = [{"emoji": emoji, "count": count} for emoji, count in counts]
        results.append({
            "id": d.id, "author_id": d.author_id, "project_id": d.project_id,
            "content": d.content, "created_at": d.created_at,
            "author": {"id": d.author.id, "name": d.author.name, "avatar_url": d.author.avatar_url or ""},
            "project": {"id": d.project.id, "title": d.project.title} if d.project else None,
            "reaction_counts": reaction_counts,
        })
    return results


# ── Reactions ────────────────────────────────────────────

@app.post("/api/devlogs/{devlog_id}/react")
def react_to_devlog(devlog_id: int, reaction: ReactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reaction.user_id = current_user.id
    devlog = db.query(Devlog).filter(Devlog.id == devlog_id).first()
    if not devlog:
        raise HTTPException(status_code=404, detail="Devlog not found")
    added = crud.toggle_reaction(db, devlog_id, reaction.user_id, reaction.emoji)
    if added:
        crud.create_notification(
            db, type="reaction", from_user_id=reaction.user_id, to_user_id=devlog.author_id,
            content=f"reacted {reaction.emoji} to your devlog",
            link=f"/",
        )
    return {"action": "added" if added else "removed"}


# ── Notifications ────────────────────────────────────────

@app.get("/api/notifications", response_model=list[NotificationResponse])
def get_notifications(
    unread_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.get_notifications(db, current_user.id, unread_only=unread_only)


@app.get("/api/notifications/count")
def get_notification_count(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"count": crud.get_unread_count(db, current_user.id)}


@app.patch("/api/notifications/{notif_id}/read")
def mark_read(notif_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not crud.mark_notification_read(db, notif_id, current_user.id):
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "read"}


@app.post("/api/notifications/read-all")
def mark_all_read(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crud.mark_all_notifications_read(db, current_user.id)
    return {"status": "all read"}


# ── Leaderboard ─────────────────────────────────────────

@app.get("/api/leaderboard", response_model=list[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    return crud.get_leaderboard(db)


# ── Endorsements ─────────────────────────────────────────

@app.post("/api/users/{user_id}/endorse")
def endorse_skill(
    user_id: int,
    data: EndorsementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Cannot endorse yourself")
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    endorsed = crud.toggle_endorsement(db, current_user.id, user_id, data.skill_name)
    if endorsed:
        crud.create_notification(
            db, type="endorsement", from_user_id=current_user.id,
            to_user_id=user_id, content=f"{current_user.name} endorsed your {data.skill_name} skill",
            link=f"/profile/{user_id}",
        )
    return {"endorsed": endorsed}


@app.get("/api/users/{user_id}/endorsements", response_model=list[EndorsementResponse])
def get_endorsements(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_user),
):
    requester_id = current_user.id if current_user else None
    return crud.get_endorsements(db, user_id, requester_id)
