from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import os

from database import engine, get_db, Base
from models import User, UserSkill, Project, Message
from schemas import UserCreate, UserResponse, ProjectCreate, ProjectResponse, MessageCreate, MessageResponse
import crud

# Create tables
Base.metadata.create_all(bind=engine)

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
    db: Session = Depends(get_db),
):
    return crud.get_users(db, skill=skill, semester=semester, department=department, search=search)


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

