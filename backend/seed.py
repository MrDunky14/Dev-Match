"""Seed the database with sample students and projects."""
from database import engine, SessionLocal, Base
from models import User, UserSkill, Project, Message
from datetime import datetime, timezone

Base.metadata.create_all(bind=engine)

SAMPLE_USERS = [
    {
        "name": "Arjun Mehta",
        "email": "arjun.mehta@campus.edu",
        "bio": "Full-stack developer obsessed with clean code and scalable architecture. Love building SaaS products.",
        "semester": 6,
        "department": "Computer Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
        "github_url": "https://github.com/arjunmehta",
        "skills": ["React", "Node.js", "TypeScript", "MongoDB", "Docker"],
    },
    {
        "name": "Priya Sharma",
        "email": "priya.sharma@campus.edu",
        "bio": "UI/UX enthusiast and frontend wizard. Passionate about creating delightful user experiences.",
        "semester": 5,
        "department": "Information Technology",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        "github_url": "https://github.com/priyasharma",
        "skills": ["Figma", "React", "CSS", "Tailwind", "JavaScript"],
    },
    {
        "name": "Rohan Kapoor",
        "email": "rohan.kapoor@campus.edu",
        "bio": "Backend engineer with a knack for system design. Building distributed systems one microservice at a time.",
        "semester": 7,
        "department": "Computer Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
        "github_url": "https://github.com/rohankapoor",
        "skills": ["Python", "FastAPI", "PostgreSQL", "Redis", "AWS"],
    },
    {
        "name": "Sneha Iyer",
        "email": "sneha.iyer@campus.edu",
        "bio": "Data science nerd who loves turning raw data into actionable insights. Kaggle competitor.",
        "semester": 6,
        "department": "Data Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
        "github_url": "https://github.com/snehaiyer",
        "skills": ["Python", "TensorFlow", "Pandas", "SQL", "Machine Learning"],
    },
    {
        "name": "Karan Patel",
        "email": "karan.patel@campus.edu",
        "bio": "Mobile developer specializing in cross-platform apps. Flutter fanatic and open-source contributor.",
        "semester": 4,
        "department": "Computer Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan",
        "github_url": "https://github.com/karanpatel",
        "skills": ["Flutter", "Dart", "Firebase", "Java", "Kotlin"],
    },
    {
        "name": "Ananya Verma",
        "email": "ananya.verma@campus.edu",
        "bio": "Cybersecurity enthusiast and ethical hacker. CTF player and bug bounty hunter.",
        "semester": 8,
        "department": "Information Technology",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
        "github_url": "https://github.com/ananyaverma",
        "skills": ["Python", "Linux", "Networking", "Cryptography", "C++"],
    },
    {
        "name": "Vikram Singh",
        "email": "vikram.singh@campus.edu",
        "bio": "DevOps engineer in the making. Automating everything that can be automated.",
        "semester": 7,
        "department": "Computer Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
        "github_url": "https://github.com/vikramsingh",
        "skills": ["Docker", "Kubernetes", "AWS", "Terraform", "GitHub Actions"],
    },
    {
        "name": "Meera Joshi",
        "email": "meera.joshi@campus.edu",
        "bio": "Creative coder blending art and tech. Love generative art, p5.js, and interactive installations.",
        "semester": 3,
        "department": "Design",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
        "github_url": "https://github.com/meerajoshi",
        "skills": ["JavaScript", "p5.js", "Three.js", "Figma", "Blender"],
    },
    {
        "name": "Aditya Rao",
        "email": "aditya.rao@campus.edu",
        "bio": "Blockchain developer and Web3 believer. Building the decentralized future one smart contract at a time.",
        "semester": 6,
        "department": "Computer Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya",
        "github_url": "https://github.com/adityarao",
        "skills": ["Solidity", "React", "Node.js", "Ethereum", "Web3.js"],
    },
    {
        "name": "Ishita Das",
        "email": "ishita.das@campus.edu",
        "bio": "AI/ML researcher focused on NLP and computer vision. Published two papers as an undergrad.",
        "semester": 8,
        "department": "Data Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishita",
        "github_url": "https://github.com/ishitadas",
        "skills": ["Python", "PyTorch", "NLP", "Computer Vision", "Hugging Face"],
    },
]

SAMPLE_PROJECTS = [
    {
        "title": "CampusEats — Food Delivery for Hostels",
        "description": "Building a hyper-local food delivery app for campus hostels. Think Swiggy but just for college. Need someone who can handle the real-time order tracking UI and a Firebase expert for the backend.",
        "owner_id": 1,
        "skills_needed": "React, Firebase, Node.js, Maps API",
        "roles_needed": "Frontend Developer, Backend Developer",
    },
    {
        "title": "AI Study Buddy — Personalized Learning Assistant",
        "description": "An AI-powered study companion that creates personalized quizzes from your notes, tracks learning progress, and suggests topics to revise. Looking for ML engineers and a clean frontend.",
        "owner_id": 4,
        "skills_needed": "Python, NLP, React, TensorFlow",
        "roles_needed": "ML Engineer, Frontend Developer",
    },
    {
        "title": "GreenCampus — Sustainability Tracker",
        "description": "Track and gamify sustainability efforts on campus — from electricity usage to waste management. Need a mobile dev for the student app and a data viz person for the admin dashboard.",
        "owner_id": 5,
        "skills_needed": "Flutter, Firebase, Python, D3.js",
        "roles_needed": "Mobile Developer, Data Visualization Expert",
    },
    {
        "title": "BlockCert — Decentralized Certificates",
        "description": "Issue tamper-proof academic certificates on the blockchain. Building with Ethereum + IPFS. Need a Solidity dev who understands smart contract security and a React dev for the verification portal.",
        "owner_id": 9,
        "skills_needed": "Solidity, React, Ethereum, IPFS, Web3.js",
        "roles_needed": "Smart Contract Developer, Frontend Developer",
    },
    {
        "title": "CodeCollab — Real-time Pair Programming",
        "description": "A VS Code-like collaborative editor for pair programming during hackathons. WebSocket-based real-time sync with video chat. Need someone strong in WebSockets and a UI/UX designer.",
        "owner_id": 3,
        "skills_needed": "Node.js, WebSocket, React, WebRTC, CSS",
        "roles_needed": "Backend Developer, UI/UX Designer",
    },
]


def seed():
    db = SessionLocal()
    try:
        # Clear existing data (order matters for FK constraints on PostgreSQL)
        db.query(Message).delete()
        db.query(UserSkill).delete()
        db.query(Project).delete()
        db.query(User).delete()
        db.commit()

        # Seed users
        for user_data in SAMPLE_USERS:
            skills = user_data.pop("skills")
            user = User(**user_data)
            db.add(user)
            db.commit()
            db.refresh(user)

            for skill in skills:
                db.add(UserSkill(user_id=user.id, skill_name=skill))
            db.commit()

        # Seed projects
        for proj_data in SAMPLE_PROJECTS:
            project = Project(**proj_data)
            db.add(project)
        db.commit()

        print(f"✅ Seeded {len(SAMPLE_USERS)} users and {len(SAMPLE_PROJECTS)} projects!")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
