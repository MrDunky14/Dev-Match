from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
import re


# ── Auth Schemas ──────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse" = None


# ── User Schemas ──────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    bio: Optional[str] = ""
    semester: int
    department: str
    avatar_url: Optional[str] = ""
    github_url: Optional[str] = ""
    github_username: Optional[str] = ""
    whatsapp_number: Optional[str] = ""
    availability: Optional[str] = "Looking for team"
    skills: list[str] = []

    @field_validator('name')
    @classmethod
    def name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Name is required')
        if len(v.strip()) > 100:
            raise ValueError('Name must be 100 characters or less')
        return v.strip()

    @field_validator('email')
    @classmethod
    def email_valid(cls, v):
        if not v or not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', v.strip()):
            raise ValueError('Valid email is required')
        return v.strip().lower()

    @field_validator('password')
    @classmethod
    def password_strong(cls, v):
        if not v or len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v

    @field_validator('semester')
    @classmethod
    def semester_range(cls, v):
        if v < 1 or v > 8:
            raise ValueError('Semester must be between 1 and 8')
        return v


class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    semester: Optional[int] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = None
    github_url: Optional[str] = None
    github_username: Optional[str] = None
    whatsapp_number: Optional[str] = None
    availability: Optional[str] = None
    skills: Optional[list[str]] = None

    @field_validator('semester')
    @classmethod
    def semester_range(cls, v):
        if v is not None and (v < 1 or v > 8):
            raise ValueError('Semester must be between 1 and 8')
        return v


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
    is_verified: bool = False
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
    demo_url: Optional[str] = ""
    github_repo_url: Optional[str] = ""


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
    demo_url: str
    github_repo_url: str
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


class ReactionCount(BaseModel):
    emoji: str
    count: int


class DevlogProjectBrief(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True


class DevlogResponse(BaseModel):
    id: int
    author_id: int
    project_id: Optional[int] = None
    content: str
    created_at: datetime
    author: AuthorBrief
    project: Optional[DevlogProjectBrief] = None
    reaction_counts: list[ReactionCount] = []

    class Config:
        from_attributes = True


# ── Reaction Schemas ──────────────────────────────────────

class ReactionCreate(BaseModel):
    user_id: int
    emoji: str


# ── Leaderboard Schemas ──────────────────────────────────

class LeaderboardEntry(BaseModel):
    id: int
    name: str
    avatar_url: str
    department: str
    semester: int
    skills: list[str]
    xp: int
    github_username: str
    is_verified: bool = False
    rank_title: str = "Novice"


# ── Notification Schemas ──────────────────────────────────

class NotificationFromUser(BaseModel):
    id: int
    name: str
    avatar_url: str

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: int
    type: str
    from_user_id: int
    to_user_id: int
    content: str
    link: str
    read: bool
    created_at: datetime
    from_user: NotificationFromUser

    class Config:
        from_attributes = True


# ── Compatibility Schema ─────────────────────────────────

class CompatibilityResponse(BaseModel):
    score: int
    shared_skills: list[str]
    complementary_skills: list[str]
    reason: str


# ── Project Update Schema ────────────────────────────────

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    skills_needed: Optional[str] = None
    roles_needed: Optional[str] = None
    status: Optional[str] = None
    demo_url: Optional[str] = None
    github_repo_url: Optional[str] = None

    @field_validator('status')
    @classmethod
    def status_valid(cls, v):
        if v is not None and v not in ('open', 'closed', 'in-progress', 'in_progress', 'showcase'):
            raise ValueError('Status must be open, closed, in-progress, in_progress, or showcase')
        return v


# ── Endorsement Schemas ────────────────────────────────────

class EndorsementCreate(BaseModel):
    skill_name: str


class EndorsementResponse(BaseModel):
    skill_name: str
    count: int
    endorsed_by_me: bool = False


# Forward reference update
TokenResponse.model_rebuild()
