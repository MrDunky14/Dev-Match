"""Seed the database with sample SLRTCE students and projects."""
from database import engine, SessionLocal, Base
from models import User, UserSkill, Project, Message, Application, Announcement, Devlog, DevlogReaction
from datetime import datetime, timezone


Base.metadata.create_all(bind=engine)


SAMPLE_USERS = [
    {
        "name": "Arjun Mehta",
        "email": "arjun.mehta@slrtce.in",
        "bio": "Full-stack developer obsessed with clean code and scalable architecture. Love building SaaS products.",
        "semester": 6,
        "department": "Computer Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
        "github_url": "https://github.com/arjunmehta",
        "github_username": "arjunmehta",
        "whatsapp_number": "9876543210",
        "availability": "Looking for team",
        "skills": ["React", "Node.js", "TypeScript", "MongoDB", "Docker"],
    },
    {
        "name": "Priya Sharma",
        "email": "priya.sharma@slrtce.in",
        "bio": "UI/UX enthusiast and frontend wizard. Passionate about creating delightful user experiences.",
        "semester": 5,
        "department": "Information Technology",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        "github_url": "https://github.com/priyasharma",
        "github_username": "priyasharma",
        "whatsapp_number": "9876543211",
        "availability": "Open to collaborate",
        "skills": ["Figma", "React", "CSS", "Tailwind", "JavaScript"],
    },
    {
        "name": "Rohan Kapoor",
        "email": "rohan.kapoor@slrtce.in",
        "bio": "Backend engineer with a knack for system design. Building distributed systems one microservice at a time.",
        "semester": 7,
        "department": "Computer Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
        "github_url": "https://github.com/rohankapoor",
        "github_username": "rohankapoor",
        "whatsapp_number": "9876543212",
        "availability": "Looking for team",
        "skills": ["Python", "FastAPI", "PostgreSQL", "Redis", "AWS"],
    },
    {
        "name": "Sneha Iyer",
        "email": "sneha.iyer@slrtce.in",
        "bio": "Data science nerd who loves turning raw data into actionable insights. Kaggle competitor.",
        "semester": 6,
        "department": "AI & Data Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
        "github_url": "https://github.com/snehaiyer",
        "github_username": "snehaiyer",
        "whatsapp_number": "",
        "availability": "Busy with project",
        "skills": ["Python", "TensorFlow", "Pandas", "SQL", "Machine Learning"],
    },
    {
        "name": "Karan Patel",
        "email": "karan.patel@slrtce.in",
        "bio": "Mobile developer specializing in cross-platform apps. Flutter fanatic and open-source contributor.",
        "semester": 4,
        "department": "Information Technology",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan",
        "github_url": "https://github.com/karanpatel",
        "github_username": "karanpatel",
        "whatsapp_number": "9876543214",
        "availability": "Looking for team",
        "skills": ["Flutter", "Dart", "Firebase", "Java", "Kotlin"],
    },
    {
        "name": "Ananya Verma",
        "email": "ananya.verma@slrtce.in",
        "bio": "Cybersecurity enthusiast and ethical hacker. CTF player and bug bounty hunter.",
        "semester": 8,
        "department": "EXTC",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
        "github_url": "https://github.com/ananyaverma",
        "github_username": "ananyaverma",
        "whatsapp_number": "9876543215",
        "availability": "Open to collaborate",
        "skills": ["Python", "Linux", "Networking", "Cryptography", "C++"],
    },
    {
        "name": "Vikram Singh",
        "email": "vikram.singh@slrtce.in",
        "bio": "DevOps engineer in the making. Automating everything that can be automated.",
        "semester": 7,
        "department": "Computer Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
        "github_url": "https://github.com/vikramsingh",
        "github_username": "vikramsingh",
        "whatsapp_number": "",
        "availability": "Not available",
        "skills": ["Docker", "Kubernetes", "AWS", "Terraform", "GitHub Actions"],
    },
    {
        "name": "Meera Joshi",
        "email": "meera.joshi@slrtce.in",
        "bio": "Creative coder blending art and tech. Love generative art, p5.js, and interactive installations.",
        "semester": 3,
        "department": "AI & Data Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
        "github_url": "https://github.com/meerajoshi",
        "github_username": "meerajoshi",
        "whatsapp_number": "9876543217",
        "availability": "Looking for team",
        "skills": ["JavaScript", "p5.js", "Three.js", "Figma", "Blender"],
    },
    {
        "name": "Aditya Rao",
        "email": "aditya.rao@slrtce.in",
        "bio": "Blockchain developer and Web3 believer. Building the decentralized future one smart contract at a time.",
        "semester": 6,
        "department": "Computer Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya",
        "github_url": "https://github.com/adityarao",
        "github_username": "adityarao",
        "whatsapp_number": "9876543218",
        "availability": "Open to collaborate",
        "skills": ["Solidity", "React", "Node.js", "Ethereum", "Web3.js"],
    },
    {
        "name": "Ishita Das",
        "email": "ishita.das@slrtce.in",
        "bio": "AI/ML researcher focused on NLP and computer vision. Published two papers as an undergrad.",
        "semester": 8,
        "department": "AI & Data Science",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishita",
        "github_url": "https://github.com/ishitadas",
        "github_username": "ishitadas",
        "whatsapp_number": "9876543219",
        "availability": "Busy with project",
        "skills": ["Python", "PyTorch", "NLP", "Computer Vision", "Hugging Face"],
    },
]

SAMPLE_PROJECTS = [
    {
        "title": "CampusEats — Food Delivery for Hostels",
        "description": "Building a hyper-local food delivery app for SLRTCE hostels. Think Swiggy but just for college. Need someone who can handle the real-time order tracking UI and a Firebase expert for the backend.",
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
        "description": "Track and gamify sustainability efforts on SLRTCE campus — from electricity usage to waste management. Need a mobile dev for the student app and a data viz person for the admin dashboard.",
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


SAMPLE_ANNOUNCEMENTS = [
    {
        "title": "🏆 HackSLRTCE 2026 — Registration Open!",
        "content": "24-hour hackathon on March 20-21. Teams of 3-4. Prizes worth ₹50K. Theme: AI for Campus. Register your team on Dev-Match and start building!",
        "tag": "hackathon",
        "author_id": 1,
    },
    {
        "title": "📚 Workshop: Intro to Docker & Kubernetes",
        "content": "Free hands-on workshop by Prof. Deshmukh on March 15, 3-5 PM in Lab 302. Bring your laptop. Pre-requisites: basic Linux commands.",
        "tag": "workshop",
        "author_id": 3,
    },
    {
        "title": "🤝 Looking for Flutter Dev for Hostel App",
        "content": "Building a food delivery app for SLRTCE hostels. Need a Flutter developer who can handle the ordering UI. DM me on WhatsApp or apply to the CampusEats project!",
        "tag": "team-needed",
        "author_id": 1,
    },
    {
        "title": "📢 GDSC SLRTCE — Web Dev Bootcamp Registration",
        "content": "8-week Web Dev bootcamp starting April 1. Learn React, Node.js, PostgreSQL. Free for all SLRTCE students. Limited to 60 seats.",
        "tag": "workshop",
        "author_id": 2,
    },
    {
        "title": "🔗 Free GitHub Student Pack — How to Apply",
        "content": "Get free access to GitHub Copilot, .tech domains, JetBrains IDEs, and more. Use your @slrtce.in email to apply at education.github.com/pack",
        "tag": "resource",
        "author_id": 6,
    },
]


SAMPLE_DEVLOGS = [
    {
        "author_id": 1,
        "project_id": 1,
        "content": "Just finished wiring up the authentication flow for CampusEats using JWTs! Next up: building the cart component. 🍔🚀"
    },
    {
        "author_id": 3,
        "project_id": 6,
        "content": "Working on the WebSocket logic for CodeCollab. Getting real-time cursor sync is tricky but it's finally working! 💻✨"
    },
    {
        "author_id": 6,
        "project_id": None,
        "content": "Does anyone know a good library for interactive graphs in React? Trying to build an admin dashboard and Chart.js feels a bit clunky. Suggestions welcome! 📊"
    },
    {
        "author_id": 8,
        "project_id": 5,
        "content": "The smart contracts for BlockCert are now fully deployed on the Sepolia testnet! Huge milestone. Ready to start testing the frontend integration. ⛓️"
    },
    {
        "author_id": 4,
        "project_id": 4,
        "content": "Trained our first custom model for the AI Study Buddy! It can successfully extract keywords from PDF notes with 85% accuracy. 🧠📚"
    }
]


def seed():
    db = SessionLocal()
    try:
        db.query(Application).delete()
        db.query(Announcement).delete()
        db.query(DevlogReaction).delete()
        db.query(Devlog).delete()
        db.query(Message).delete()
        db.query(UserSkill).delete()
        db.query(Project).delete()
        db.query(User).delete()
        db.commit()

        for user_data in SAMPLE_USERS:
            skills = user_data.pop("skills")
            user = User(**user_data)
            db.add(user)
            db.commit()
            db.refresh(user)
            for skill in skills:
                db.add(UserSkill(user_id=user.id, skill_name=skill))
            db.commit()

        for proj_data in SAMPLE_PROJECTS:
            db.add(Project(**proj_data))
        db.commit()

        for ann_data in SAMPLE_ANNOUNCEMENTS:
            db.add(Announcement(**ann_data))
        db.commit()

        for devlog_data in SAMPLE_DEVLOGS:
            db.add(Devlog(**devlog_data))
        db.commit()

        print(f"✅ Seeded {len(SAMPLE_USERS)} users, {len(SAMPLE_PROJECTS)} projects, {len(SAMPLE_ANNOUNCEMENTS)} announcements, {len(SAMPLE_DEVLOGS)} devlogs!")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
