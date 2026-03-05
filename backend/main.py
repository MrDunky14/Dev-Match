from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import os

from database import engine, get_db, Base
from models import User, UserSkill, Project, Message, Application, Announcement, Devlog
from schemas import (
    UserCreate, UserResponse, ProjectCreate, ProjectResponse,
    MessageCreate, MessageResponse, ApplicationCreate, ApplicationResponse,
    AnnouncementCreate, AnnouncementResponse, DevlogCreate, DevlogResponse
)
from github_service import fetch_github_profile
import crud

# Create tables
Base.metadata.create_all(bind=engine)

# Auto-seed if database is empty (needed for Render free tier — no shell access)
def auto_seed():
    from seed import seed
    db = next(get_db())
    try:
        if db.query(User).count() == 0:
            print("⚡ Database empty — auto-seeding...")
            seed()
    finally:
        db.close()

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


# ── Devlogs ───────────────────────────────────────────────

@app.post("/api/devlogs", response_model=DevlogResponse)
def create_devlog(devlog: DevlogCreate, db: Session = Depends(get_db)):
    if not crud.get_user(db, devlog.author_id):
        raise HTTPException(status_code=404, detail="Author not found")
    if devlog.project_id and not crud.get_project(db, devlog.project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.create_devlog(db, devlog)


@app.get("/api/devlogs", response_model=list[DevlogResponse])
def list_devlogs(limit: int = Query(50), db: Session = Depends(get_db)):
    return crud.get_devlogs(db, limit=limit)
