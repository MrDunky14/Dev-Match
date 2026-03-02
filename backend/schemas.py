from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── User Schemas ──────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: str
    bio: Optional[str] = ""
    semester: int
    department: str
    avatar_url: Optional[str] = ""
    github_url: Optional[str] = ""
    skills: list[str] = []


class SkillResponse(BaseModel):
    id: int
    skill_name: str

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    bio: str
    semester: int
    department: str
    avatar_url: str
    github_url: str
    created_at: datetime
    skills: list[SkillResponse] = []

    class Config:
        from_attributes = True


# ── Project Schemas ───────────────────────────────────────

class ProjectCreate(BaseModel):
    title: str
    description: str
    owner_id: int
    skills_needed: Optional[str] = ""
    roles_needed: Optional[str] = ""


class ProjectOwnerBrief(BaseModel):
    id: int
    name: str
    avatar_url: str

    class Config:
        from_attributes = True


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    owner_id: int
    skills_needed: str
    roles_needed: str
    status: str
    created_at: datetime
    owner: ProjectOwnerBrief

    class Config:
        from_attributes = True


# ── Message Schemas ───────────────────────────────────────

class MessageCreate(BaseModel):
    sender_id: int
    receiver_id: int
    content: str


class MessageSenderBrief(BaseModel):
    id: int
    name: str
    avatar_url: str

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    created_at: datetime
    sender: MessageSenderBrief

    class Config:
        from_attributes = True
