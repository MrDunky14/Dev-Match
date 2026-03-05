from pydantic import BaseModel
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
    github_username: Optional[str] = ""
    whatsapp_number: Optional[str] = ""
    availability: Optional[str] = "Looking for team"
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
    github_username: str
    whatsapp_number: str
    availability: str
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


# ── GitHub Schemas ────────────────────────────────────────

class GitHubRepo(BaseModel):
    name: str
    description: Optional[str] = ""
    language: Optional[str] = ""
    stars: int = 0
    url: str
    updated_at: str


class GitHubProfile(BaseModel):
    username: str
    name: Optional[str] = ""
    avatar_url: str = ""
    bio: Optional[str] = ""
    public_repos: int = 0
    followers: int = 0
    repos: list[GitHubRepo] = []
    detected_skills: list[str] = []


# ── Application Schemas ───────────────────────────────────

class ApplicationCreate(BaseModel):
    project_id: int
    applicant_id: int
    message: Optional[str] = ""


class ApplicantBrief(BaseModel):
    id: int
    name: str
    avatar_url: str
    department: str
    semester: int

    class Config:
        from_attributes = True


class ApplicationResponse(BaseModel):
    id: int
    project_id: int
    applicant_id: int
    message: str
    status: str
    created_at: datetime
    applicant: ApplicantBrief

    class Config:
        from_attributes = True


# ── Announcement Schemas ──────────────────────────────────

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    tag: Optional[str] = "general"
    author_id: int


class AuthorBrief(BaseModel):
    id: int
    name: str
    avatar_url: str

    class Config:
        from_attributes = True


class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    tag: str
    author_id: int
    created_at: datetime
    author: AuthorBrief

    class Config:
        from_attributes = True


# ── Devlog Schemas ────────────────────────────────────────

class DevlogCreate(BaseModel):
    author_id: int
    project_id: Optional[int] = None
    content: str


class DevlogResponse(BaseModel):
    id: int
    author_id: int
    project_id: Optional[int] = None
    content: str
    created_at: datetime
    author: AuthorBrief
    project: Optional[ProjectOwnerBrief] = None

    class Config:
        from_attributes = True
