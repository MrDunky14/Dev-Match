from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import os

from database import engine, get_db, Base
from models import User, UserSkill, Project, Message, Application, Announcement, Devlog, DevlogReaction
from schemas import (
    UserCreate, UserResponse, ProjectCreate, ProjectResponse,
    MessageCreate, MessageResponse, ApplicationCreate, ApplicationResponse,
    AnnouncementCreate, AnnouncementResponse, DevlogCreate, DevlogResponse,
    ReactionCreate, ReactionCount, LeaderboardEntry,
)
from github_service import fetch_github_profile
import crud

# Drop and recreate all tables to ensure schema is always in sync
# (Safe because all data is seed data — no user-generated content to lose yet)
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# Always re-seed after fresh schema
def auto_seed():
    from seed import seed
    try:
        print("⚡ Fresh schema — seeding database...")
        seed()
    except Exception as e:
        print(f"⚠️ Seed error (non-fatal): {e}")

auto_seed()

app = FastAPI(title="Dev-Match API", version="1.0.0")

# CORS
origins = [
    "https://dev-match-tau.vercel.app",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Users ─────────────────────────────────────────────────

@app.post("/api/users", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)


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


@app.get("/api/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/api/users/by-email/{email}", response_model=UserResponse)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/api/users/{user_id}/projects", response_model=list[ProjectResponse])
def get_user_projects(user_id: int, db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.owner_id == user_id).order_by(Project.created_at.desc()).all()


@app.get("/api/users/{user_id}/received-applications")
def get_received_applications(user_id: int, db: Session = Depends(get_db)):
    """Applications TO this user's projects."""
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
    """Applications BY this user."""
    apps = db.query(Application).filter(Application.applicant_id == user_id).order_by(Application.created_at.desc()).all()
    return [
        {
            "id": a.id, "status": a.status, "message": a.message,
            "created_at": a.created_at,
            "project": {"id": a.project.id, "title": a.project.title},
        }
        for a in apps
    ]


# ── Projects ─────────────────────────────────────────────

@app.post("/api/projects", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    owner = crud.get_user(db, project.owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
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


# ── Messages ───────────────────────────────────────

@app.post("/api/messages", response_model=MessageResponse)
def send_message(msg: MessageCreate, db: Session = Depends(get_db)):
    if not crud.get_user(db, msg.sender_id):
        raise HTTPException(status_code=404, detail="Sender not found")
    if not crud.get_user(db, msg.receiver_id):
        raise HTTPException(status_code=404, detail="Receiver not found")
    if msg.sender_id == msg.receiver_id:
        raise HTTPException(status_code=400, detail="Cannot message yourself")
    return crud.create_message(db, msg)


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


# ── Applications ──────────────────────────────────────────

@app.post("/api/projects/{project_id}/apply", response_model=ApplicationResponse)
def apply_to_project(project_id: int, app: ApplicationCreate, db: Session = Depends(get_db)):
    if not crud.get_project(db, project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    if not crud.get_user(db, app.applicant_id):
        raise HTTPException(status_code=404, detail="Applicant not found")
    app.project_id = project_id
    return crud.create_application(db, app)


@app.get("/api/projects/{project_id}/applications", response_model=list[ApplicationResponse])
def get_project_applications(project_id: int, db: Session = Depends(get_db)):
    return crud.get_applications_for_project(db, project_id)


@app.get("/api/projects/{project_id}/application-count")
def get_application_count(project_id: int, db: Session = Depends(get_db)):
    return {"count": crud.get_application_count(db, project_id)}


@app.patch("/api/applications/{app_id}")
def update_application(app_id: int, status: str = Query(...), db: Session = Depends(get_db)):
    if status not in ("accepted", "rejected"):
        raise HTTPException(status_code=400, detail="Status must be 'accepted' or 'rejected'")
    result = crud.update_application_status(db, app_id, status)
    if not result:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"status": "updated"}


# ── Announcements ─────────────────────────────────────────

@app.post("/api/announcements", response_model=AnnouncementResponse)
def create_announcement(ann: AnnouncementCreate, db: Session = Depends(get_db)):
    if not crud.get_user(db, ann.author_id):
        raise HTTPException(status_code=404, detail="Author not found")
    return crud.create_announcement(db, ann)


@app.get("/api/announcements", response_model=list[AnnouncementResponse])
def list_announcements(tag: Optional[str] = Query(None), db: Session = Depends(get_db)):
    return crud.get_announcements(db, tag=tag)


# ── GitHub ────────────────────────────────────────────────

@app.get("/api/github/{username}")
async def get_github_profile(username: str):
    result = await fetch_github_profile(username)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


# ── Devlogs ───────────────────────────────────────────────

@app.post("/api/devlogs", response_model=DevlogResponse)
def create_devlog(devlog: DevlogCreate, db: Session = Depends(get_db)):
    if not crud.get_user(db, devlog.author_id):
        raise HTTPException(status_code=404, detail="Author not found")
    if devlog.project_id and not crud.get_project(db, devlog.project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.create_devlog(db, devlog)


@app.get("/api/devlogs")
def list_devlogs(limit: int = Query(50), db: Session = Depends(get_db)):
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
def react_to_devlog(devlog_id: int, reaction: ReactionCreate, db: Session = Depends(get_db)):
    devlog = db.query(Devlog).filter(Devlog.id == devlog_id).first()
    if not devlog:
        raise HTTPException(status_code=404, detail="Devlog not found")
    if not crud.get_user(db, reaction.user_id):
        raise HTTPException(status_code=404, detail="User not found")
    added = crud.toggle_reaction(db, devlog_id, reaction.user_id, reaction.emoji)
    return {"action": "added" if added else "removed"}


# ── Leaderboard ─────────────────────────────────────────

@app.get("/api/leaderboard", response_model=list[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    return crud.get_leaderboard(db)
