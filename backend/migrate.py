"""One-time migration script to align SQLite schema with models."""
import sqlite3

conn = sqlite3.connect('sql_app.db')
c = conn.cursor()

# Check existing tables
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in c.fetchall()]
print("Existing tables:", tables)

# Check projects columns
c.execute("PRAGMA table_info(projects)")
proj_cols = [r[1] for r in c.fetchall()]
print("Project columns:", proj_cols)

# Add missing columns to projects
if 'demo_url' not in proj_cols:
    c.execute("ALTER TABLE projects ADD COLUMN demo_url TEXT DEFAULT ''")
    print("Added demo_url to projects")

if 'github_repo_url' not in proj_cols:
    c.execute("ALTER TABLE projects ADD COLUMN github_repo_url TEXT DEFAULT ''")
    print("Added github_repo_url to projects")

# Create applications table if missing
if 'applications' not in tables:
    c.execute("""
        CREATE TABLE applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            applicant_id INTEGER NOT NULL,
            message TEXT DEFAULT '',
            status VARCHAR(20) DEFAULT 'pending',
            created_at DATETIME,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (applicant_id) REFERENCES users(id)
        )
    """)
    c.execute("CREATE INDEX ix_applications_id ON applications(id)")
    c.execute("CREATE INDEX ix_applications_project_id ON applications(project_id)")
    c.execute("CREATE INDEX ix_applications_applicant_id ON applications(applicant_id)")
    print("Created applications table")

# Create announcements table if missing
if 'announcements' not in tables:
    c.execute("""
        CREATE TABLE announcements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(200) NOT NULL,
            content TEXT NOT NULL,
            tag VARCHAR(30) DEFAULT 'general',
            author_id INTEGER NOT NULL,
            created_at DATETIME,
            FOREIGN KEY (author_id) REFERENCES users(id)
        )
    """)
    c.execute("CREATE INDEX ix_announcements_id ON announcements(id)")
    c.execute("CREATE INDEX ix_announcements_author_id ON announcements(author_id)")
    print("Created announcements table")

# Create devlogs table if missing
if 'devlogs' not in tables:
    c.execute("""
        CREATE TABLE devlogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_id INTEGER NOT NULL,
            project_id INTEGER,
            content TEXT NOT NULL,
            created_at DATETIME,
            FOREIGN KEY (author_id) REFERENCES users(id),
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
        )
    """)
    c.execute("CREATE INDEX ix_devlogs_id ON devlogs(id)")
    c.execute("CREATE INDEX ix_devlogs_author_id ON devlogs(author_id)")
    c.execute("CREATE INDEX ix_devlogs_project_id ON devlogs(project_id)")
    print("Created devlogs table")

# Create devlog_reactions table if missing
if 'devlog_reactions' not in tables:
    c.execute("""
        CREATE TABLE devlog_reactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            devlog_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            emoji VARCHAR(10) NOT NULL,
            FOREIGN KEY (devlog_id) REFERENCES devlogs(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE (devlog_id, user_id, emoji)
        )
    """)
    c.execute("CREATE INDEX ix_devlog_reactions_id ON devlog_reactions(id)")
    c.execute("CREATE INDEX ix_devlog_reactions_devlog_id ON devlog_reactions(devlog_id)")
    c.execute("CREATE INDEX ix_devlog_reactions_user_id ON devlog_reactions(user_id)")
    print("Created devlog_reactions table")

# Create endorsements table if missing
if 'endorsements' not in tables:
    c.execute("""
        CREATE TABLE endorsements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_user_id INTEGER NOT NULL,
            to_user_id INTEGER NOT NULL,
            skill_name VARCHAR(50) NOT NULL,
            created_at DATETIME,
            FOREIGN KEY (from_user_id) REFERENCES users(id),
            FOREIGN KEY (to_user_id) REFERENCES users(id),
            UNIQUE (from_user_id, to_user_id, skill_name)
        )
    """)
    c.execute("CREATE INDEX ix_endorsements_from_user_id ON endorsements(from_user_id)")
    c.execute("CREATE INDEX ix_endorsements_to_user_id ON endorsements(to_user_id)")
    c.execute("CREATE INDEX ix_endorsements_id ON endorsements(id)")
    print("Created endorsements table")

# Create notifications table if missing
if 'notifications' not in tables:
    c.execute("""
        CREATE TABLE notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type VARCHAR(50) NOT NULL,
            from_user_id INTEGER NOT NULL,
            to_user_id INTEGER NOT NULL,
            content TEXT DEFAULT '',
            link VARCHAR(300) DEFAULT '',
            read BOOLEAN DEFAULT 0,
            created_at DATETIME,
            FOREIGN KEY (from_user_id) REFERENCES users(id),
            FOREIGN KEY (to_user_id) REFERENCES users(id)
        )
    """)
    c.execute("CREATE INDEX ix_notifications_id ON notifications(id)")
    print("Created notifications table")

conn.commit()

# Final verification
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
final_tables = [r[0] for r in c.fetchall()]
print("\nFinal tables:", final_tables)

conn.close()
print("Migration complete!")
