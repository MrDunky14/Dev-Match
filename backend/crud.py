from sqlalchemy.orm import Session
from sqlalchemy import func
from models import User, UserSkill, Project, Message, Application, Announcement, Devlog, DevlogReaction
from schemas import UserCreate, ProjectCreate, MessageCreate, ApplicationCreate, AnnouncementCreate, DevlogCreate, ReactionCreate
from typing import Optional


# ── Users ─────────────────────────────────────────────────

def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(
        name=user.name,
        email=user.email,
        bio=user.bio,
        semester=user.semester,
        department=user.department,
        avatar_url=user.avatar_url,
        github_url=user.github_url,
        github_username=user.github_username,
        whatsapp_number=user.whatsapp_number,
        availability=user.availability,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    for skill in user.skills:
        db_skill = UserSkill(user_id=db_user.id, skill_name=skill.strip())
        db.add(db_skill)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_users(
    db: Session,
    skill: Optional[str] = None,
    semester: Optional[int] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
    availability: Optional[str] = None,
) -> list[User]:
    query = db.query(User)

    if skill:
        query = query.join(UserSkill).filter(
            func.lower(UserSkill.skill_name) == skill.lower()
        )
    if semester:
        query = query.filter(User.semester == semester)
    if department:
        query = query.filter(func.lower(User.department) == department.lower())
    if search:
        query = query.filter(User.name.ilike(f"%{search}%"))
    if availability:
        query = query.filter(func.lower(User.availability) == availability.lower())

    return query.distinct().order_by(User.created_at.desc()).all()


def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


# ── Projects ─────────────────────────────────────────────

def create_project(db: Session, project: ProjectCreate) -> Project:
    db_project = Project(
        title=project.title,
        description=project.description,
        owner_id=project.owner_id,
        skills_needed=project.skills_needed,
        roles_needed=project.roles_needed,
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def get_projects(
    db: Session,
    skill: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
) -> list[Project]:
    query = db.query(Project)

    if skill:
        query = query.filter(Project.skills_needed.ilike(f"%{skill}%"))
    if status:
        query = query.filter(Project.status == status)
    if search:
        query = query.filter(
            (Project.title.ilike(f"%{search}%"))
            | (Project.description.ilike(f"%{search}%"))
        )

    return query.order_by(Project.created_at.desc()).all()


def get_project(db: Session, project_id: int) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()


# ── Skills (distinct list) ───────────────────────────────

def get_all_skills(db: Session) -> list[str]:
    results = db.query(UserSkill.skill_name).distinct().order_by(UserSkill.skill_name).all()
    return [r[0] for r in results]


# ── Messages ─────────────────────────────────────────────

def create_message(db: Session, msg: MessageCreate) -> Message:
    db_msg = Message(
        sender_id=msg.sender_id,
        receiver_id=msg.receiver_id,
        content=msg.content,
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg


def get_messages_for_user(db: Session, user_id: int) -> list[Message]:
    return (
        db.query(Message)
        .filter((Message.receiver_id == user_id) | (Message.sender_id == user_id))
        .order_by(Message.created_at.desc())
        .all()
    )


def get_messages_between(db: Session, user1_id: int, user2_id: int) -> list[Message]:
    return (
        db.query(Message)
        .filter(
            ((Message.sender_id == user1_id) & (Message.receiver_id == user2_id))
            | ((Message.sender_id == user2_id) & (Message.receiver_id == user1_id))
        )
        .order_by(Message.created_at.asc())
        .all()
    )


# ── Applications ─────────────────────────────────────────

def create_application(db: Session, app: ApplicationCreate) -> Application:
    # Check for duplicate
    existing = db.query(Application).filter(
        Application.project_id == app.project_id,
        Application.applicant_id == app.applicant_id,
    ).first()
    if existing:
        return existing  # Don't create duplicates

    db_app = Application(
        project_id=app.project_id,
        applicant_id=app.applicant_id,
        message=app.message,
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app


def get_applications_for_project(db: Session, project_id: int) -> list[Application]:
    return (
        db.query(Application)
        .filter(Application.project_id == project_id)
        .order_by(Application.created_at.desc())
        .all()
    )


def get_application_count(db: Session, project_id: int) -> int:
    return db.query(Application).filter(Application.project_id == project_id).count()


def update_application_status(db: Session, app_id: int, status: str) -> Optional[Application]:
    app = db.query(Application).filter(Application.id == app_id).first()
    if app:
        app.status = status
        db.commit()
        db.refresh(app)
    return app


# ── Announcements ────────────────────────────────────────

def create_announcement(db: Session, ann: AnnouncementCreate) -> Announcement:
    db_ann = Announcement(
        title=ann.title,
        content=ann.content,
        tag=ann.tag,
        author_id=ann.author_id,
    )
    db.add(db_ann)
    db.commit()
    db.refresh(db_ann)
    return db_ann


def get_announcements(db: Session, tag: str = None) -> list[Announcement]:
    q = db.query(Announcement)
    if tag:
        q = q.filter(Announcement.tag == tag)
    return q.order_by(Announcement.created_at.desc()).all()


# ── Devlogs ──────────────────────────────────────────────

def create_devlog(db: Session, devlog: DevlogCreate) -> Devlog:
    db_devlog = Devlog(
        author_id=devlog.author_id,
        project_id=devlog.project_id,
        content=devlog.content,
    )
    db.add(db_devlog)
    db.commit()
    db.refresh(db_devlog)
    return db_devlog


def get_devlogs(db: Session, limit: int = 50) -> list[Devlog]:
    return (
        db.query(Devlog)
        .order_by(Devlog.created_at.desc())
        .limit(limit)
        .all()
    )


# ── Reactions ─────────────────────────────────────────────

def toggle_reaction(db: Session, devlog_id: int, user_id: int, emoji: str):
    existing = db.query(DevlogReaction).filter(
        DevlogReaction.devlog_id == devlog_id,
        DevlogReaction.user_id == user_id,
        DevlogReaction.emoji == emoji,
    ).first()
    if existing:
        db.delete(existing)
        db.commit()
        return False  # removed
    else:
        db.add(DevlogReaction(devlog_id=devlog_id, user_id=user_id, emoji=emoji))
        db.commit()
        return True  # added


def get_reaction_counts(db: Session, devlog_id: int):
    return (
        db.query(DevlogReaction.emoji, func.count(DevlogReaction.id))
        .filter(DevlogReaction.devlog_id == devlog_id)
        .group_by(DevlogReaction.emoji)
        .all()
    )


# ── Leaderboard ──────────────────────────────────────────

def get_leaderboard(db: Session):
    users = db.query(User).all()
    result = []
    for u in users:
        xp = 0
        # Profile completeness (20%)
        filled = sum([
            bool(u.bio), bool(u.avatar_url), bool(u.github_url),
            bool(u.github_username), bool(u.whatsapp_number),
        ])
        xp += filled * 10  # max 50
        # Skills (15%)
        skill_count = len(u.skills)
        xp += min(skill_count * 8, 40)  # max 40
        # Projects posted (15%)
        project_count = db.query(Project).filter(Project.owner_id == u.id).count()
        xp += min(project_count * 15, 45)  # max 45
        # Devlogs posted (15%)
        devlog_count = db.query(Devlog).filter(Devlog.author_id == u.id).count()
        xp += min(devlog_count * 12, 36)  # max 36
        # Applications (10%)
        app_count = db.query(Application).filter(Application.applicant_id == u.id).count()
        xp += min(app_count * 10, 30)  # max 30
        # Messages sent (10%)
        msg_count = db.query(Message).filter(Message.sender_id == u.id).count()
        xp += min(msg_count * 5, 25)  # max 25
        # GitHub bonus (15%)
        if u.github_username:
            xp += 25

        result.append({
            "id": u.id,
            "name": u.name,
            "avatar_url": u.avatar_url or "",
            "department": u.department,
            "semester": u.semester,
            "skills": [s.skill_name for s in u.skills],
            "xp": xp,
            "github_username": u.github_username or "",
        })
    result.sort(key=lambda x: x["xp"], reverse=True)
    return result
