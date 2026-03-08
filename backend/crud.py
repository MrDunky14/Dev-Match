from sqlalchemy.orm import Session
from sqlalchemy import func
from models import User, UserSkill, Project, Message, Application, Announcement, Devlog, DevlogReaction, Notification, Endorsement
from schemas import UserCreate, UserUpdate, ProjectCreate, ProjectUpdate, MessageCreate, ApplicationCreate, AnnouncementCreate, DevlogCreate, ReactionCreate
from typing import Optional
from auth import hash_password
import bleach


def sanitize(text: str) -> str:
    """Strip any HTML tags from user input."""
    return bleach.clean(text, tags=[], strip=True) if text else ""


# ── Users ─────────────────────────────────────────────────

def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(
        name=sanitize(user.name),
        email=user.email.strip().lower(),
        password_hash=hash_password(user.password),
        bio=sanitize(user.bio),
        semester=user.semester,
        department=user.department,
        avatar_url=user.avatar_url or "",
        github_url=user.github_url or "",
        github_username=user.github_username or "",
        whatsapp_number=user.whatsapp_number or "",
        availability=user.availability or "Looking for team",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    for skill in user.skills:
        db_skill = UserSkill(user_id=db_user.id, skill_name=sanitize(skill.strip()))
        db.add(db_skill)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user: User, data: UserUpdate) -> User:
    if data.name is not None:
        user.name = sanitize(data.name)
    if data.bio is not None:
        user.bio = sanitize(data.bio)
    if data.semester is not None:
        user.semester = data.semester
    if data.department is not None:
        user.department = data.department
    if data.avatar_url is not None:
        user.avatar_url = data.avatar_url
    if data.github_url is not None:
        user.github_url = data.github_url
    if data.github_username is not None:
        user.github_username = data.github_username
    if data.whatsapp_number is not None:
        user.whatsapp_number = data.whatsapp_number
    if data.availability is not None:
        user.availability = data.availability

    if data.skills is not None:
        # Replace all skills
        db.query(UserSkill).filter(UserSkill.user_id == user.id).delete()
        for skill in data.skills:
            db.add(UserSkill(user_id=user.id, skill_name=sanitize(skill.strip())))

    db.commit()
    db.refresh(user)
    return user


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
        demo_url=project.demo_url or "",
        github_repo_url=project.github_repo_url or "",
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


def update_project(db: Session, project: Project, data: ProjectUpdate) -> Project:
    if data.title is not None:
        project.title = sanitize(data.title)
    if data.description is not None:
        project.description = sanitize(data.description)
    if data.skills_needed is not None:
        project.skills_needed = sanitize(data.skills_needed)
    if data.roles_needed is not None:
        project.roles_needed = sanitize(data.roles_needed)
    if data.status is not None:
        project.status = data.status
    if data.demo_url is not None:
        project.demo_url = data.demo_url
    if data.github_repo_url is not None:
        project.github_repo_url = data.github_repo_url
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project):
    db.delete(project)
    db.commit()


# ── Skills (distinct list) ───────────────────────────────

def get_all_skills(db: Session) -> list[str]:
    results = db.query(UserSkill.skill_name).distinct().order_by(UserSkill.skill_name).all()
    return [r[0] for r in results]


# ── Messages ─────────────────────────────────────────────

def create_message(db: Session, msg: MessageCreate) -> Message:
    db_msg = Message(
        sender_id=msg.sender_id,
        receiver_id=msg.receiver_id,
        content=sanitize(msg.content),
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
        title=sanitize(ann.title),
        content=sanitize(ann.content),
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
        content=sanitize(devlog.content),
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

def _rank_title(xp: int) -> str:
    if xp >= 450:
        return "Titan"
    if xp >= 250:
        return "Architect"
    if xp >= 100:
        return "Builder"
    return "Novice"


def get_leaderboard(db: Session):
    # Batch-count activity per user (avoids N+1 queries)
    def _counts(model, col):
        return dict(db.query(col, func.count(model.id)).group_by(col).all())

    project_counts = _counts(Project, Project.owner_id)
    devlog_counts = _counts(Devlog, Devlog.author_id)
    app_counts = _counts(Application, Application.applicant_id)
    msg_counts = _counts(Message, Message.sender_id)

    from github_service import _get_cached

    users = db.query(User).all()
    result = []
    for u in users:
        xp = 0

        # Profile completeness (max 50)
        xp += sum(10 for f in [u.bio, u.avatar_url, u.github_url, u.github_username, u.whatsapp_number] if f)

        # Skills (max 40)
        xp += min(len(u.skills) * 8, 40)

        # Projects posted (max 60)
        xp += min(project_counts.get(u.id, 0) * 20, 60)

        # Devlogs (max 40)
        xp += min(devlog_counts.get(u.id, 0) * 10, 40)

        # Community engagement: apps + messages (combined max 40)
        xp += min(app_counts.get(u.id, 0) * 7 + msg_counts.get(u.id, 0) * 2, 40)

        # GitHub authenticity bonus (max 70)
        github_xp = 0
        if u.github_username:
            cached = _get_cached(f"github:{u.github_username}")
            if cached and "error" not in cached:
                github_xp += min(cached.get("public_repos", 0) * 2, 25)
                github_xp += min(cached.get("followers", 0) * 3, 15)
                if cached.get("recently_active"):
                    github_xp += 15
                github_xp += min(len(cached.get("detected_skills", [])) * 5, 15)
        xp += github_xp

        result.append({
            "id": u.id,
            "name": u.name,
            "avatar_url": u.avatar_url or "",
            "department": u.department,
            "semester": u.semester,
            "skills": [s.skill_name for s in u.skills],
            "xp": xp,
            "github_username": u.github_username or "",
            "rank_title": _rank_title(xp),
        })
    result.sort(key=lambda x: x["xp"], reverse=True)
    return result


# ── Notifications ────────────────────────────────────────

def create_notification(
    db: Session,
    type: str,
    from_user_id: int,
    to_user_id: int,
    content: str = "",
    link: str = "",
) -> Notification:
    if from_user_id == to_user_id:
        return None  # Don't notify yourself
    notif = Notification(
        type=type,
        from_user_id=from_user_id,
        to_user_id=to_user_id,
        content=sanitize(content),
        link=link,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def get_notifications(db: Session, user_id: int, unread_only: bool = False) -> list[Notification]:
    q = db.query(Notification).filter(Notification.to_user_id == user_id)
    if unread_only:
        q = q.filter(Notification.read == False)
    return q.order_by(Notification.created_at.desc()).limit(50).all()


def get_unread_count(db: Session, user_id: int) -> int:
    return db.query(Notification).filter(
        Notification.to_user_id == user_id,
        Notification.read == False,
    ).count()


def mark_notification_read(db: Session, notif_id: int, user_id: int) -> bool:
    notif = db.query(Notification).filter(
        Notification.id == notif_id,
        Notification.to_user_id == user_id,
    ).first()
    if notif:
        notif.read = True
        db.commit()
        return True
    return False


def mark_all_notifications_read(db: Session, user_id: int):
    db.query(Notification).filter(
        Notification.to_user_id == user_id,
        Notification.read == False,
    ).update({"read": True})
    db.commit()


# ── Compatibility ────────────────────────────────────────

def get_compatibility(db: Session, user1_id: int, user2_id: int) -> dict:
    user1 = db.query(User).filter(User.id == user1_id).first()
    user2 = db.query(User).filter(User.id == user2_id).first()
    if not user1 or not user2:
        return {"score": 0, "shared_skills": [], "complementary_skills": [], "reason": "User not found"}

    skills1 = {s.skill_name.lower(): s.skill_name for s in user1.skills}
    skills2 = {s.skill_name.lower(): s.skill_name for s in user2.skills}

    shared = [skills1[k] for k in skills1 if k in skills2]
    only_them = [skills2[k] for k in skills2 if k not in skills1]

    # Score computation:
    # Shared skills (mutual foundation) = 15pts each, max 45
    # Complementary skills (what they add) = 10pts each, max 40
    # Semester proximity = up to 15pts
    shared_score = min(len(shared) * 15, 45)
    comp_score = min(len(only_them) * 10, 40)

    semester_diff = abs(user1.semester - user2.semester)
    semester_score = max(15 - semester_diff * 5, 0)

    total = shared_score + comp_score + semester_score

    # Build reason string
    parts = []
    if shared:
        parts.append(f"You both know {', '.join(shared[:3])}")
    if only_them:
        parts.append(f"they add {', '.join(only_them[:3])} you're missing")
    if semester_diff <= 1:
        parts.append("same semester range")
    reason = " — ".join(parts) if parts else "Different skill sets"

    return {
        "score": min(total, 100),
        "shared_skills": shared,
        "complementary_skills": only_them,
        "reason": reason,
    }


# ── Endorsements ──────────────────────────────────────────

def toggle_endorsement(db: Session, from_user_id: int, to_user_id: int, skill_name: str) -> bool:
    """Toggle an endorsement. Returns True if endorsed, False if un-endorsed."""
    existing = db.query(Endorsement).filter(
        Endorsement.from_user_id == from_user_id,
        Endorsement.to_user_id == to_user_id,
        Endorsement.skill_name == skill_name,
    ).first()
    if existing:
        db.delete(existing)
        db.commit()
        return False
    endo = Endorsement(from_user_id=from_user_id, to_user_id=to_user_id, skill_name=skill_name)
    db.add(endo)
    db.commit()
    return True


def get_endorsements(db: Session, user_id: int, requester_id: int | None = None) -> list[dict]:
    """Get endorsement counts per skill for a user, with whether requester endorsed each."""
    rows = db.query(Endorsement.skill_name, func.count(Endorsement.id)).filter(
        Endorsement.to_user_id == user_id
    ).group_by(Endorsement.skill_name).all()

    my_endorsed = set()
    if requester_id:
        my = db.query(Endorsement.skill_name).filter(
            Endorsement.from_user_id == requester_id,
            Endorsement.to_user_id == user_id,
        ).all()
        my_endorsed = {r[0] for r in my}

    return [
        {"skill_name": skill, "count": count, "endorsed_by_me": skill in my_endorsed}
        for skill, count in rows
    ]
