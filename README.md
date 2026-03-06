<div align="center">

# ⚡ Dev-Match

### The Campus Team Finder That Actually Works

*No great project should die because you couldn't find a teammate.*

[![Live](https://img.shields.io/badge/🌐_Live-dev--match.vercel.app-7c3aed?style=for-the-badge)](https://dev-match-tau.vercel.app)
[![Backend](https://img.shields.io/badge/🔧_API-render.com-06d6a0?style=for-the-badge)](https://dev-match-qcjf.onrender.com/docs)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)

</div>

---

## 🎯 What is Dev-Match?

Dev-Match is a **campus-specific developer matching platform** built exclusively for SLRTCE students (Semesters 1–8). It solves the "anyone knows React?" WhatsApp chaos by letting students discover teammates by **skill, semester, department**, and **real GitHub activity**.

> **Key differentiator**: Every feature works end-to-end with a real PostgreSQL backend. No mock data, no `alert()` buttons, no feature bombing.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Smart Discovery** | Filter developers by skill, semester, department, availability |
| 🔗 **GitHub Integration** | Auto-detect skills, language breakdown bars, latest commit display |
| ⚡ **Live Devlog Feed** | Share what you're building, react with 🔥👏🚀 |
| 🚀 **Project Board** | Post projects, apply with one click, manage applications |
| 🏆 **Leaderboard** | Server-side XP computed from real activity |
| 📊 **Dashboard** | Manage your projects, accept/reject applicants, track status |
| 🔐 **Login System** | Email-based authentication for returning users |
| 🔗 **Dev Toolkit** | Curated links to 28 tools across 7 categories (LeetCode, Figma, ChatGPT...) |
| 📌 **Notice Board** | Campus announcements tagged by type |
| 💬 **Direct Messaging** | In-app messaging + WhatsApp integration |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, React Router 7, Axios |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy, Pydantic |
| **Database** | PostgreSQL (hosted on Render) |
| **Design** | Dark Neon Glassmorphism, CSS Animations, Inter + Outfit fonts |
| **Hosting** | Vercel (frontend) + Render (backend + DB) |
| **External API** | GitHub REST API v3 |

**Total frontend dependencies: 4** (React, React-DOM, React-Router, Axios)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (or use SQLite locally)

### Setup
```bash
# Clone
git clone https://github.com/MrDunky14/Dev-Match.git
cd Dev-Match

# Backend
cd backend
pip install -r requirements.txt
python seed.py
python -m uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 📁 Project Structure

```
Dev-Match/
├── backend/
│   ├── main.py          # FastAPI app + all routes
│   ├── models.py        # SQLAlchemy models (User, Project, Message, etc.)
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── crud.py          # Database operations
│   ├── database.py      # DB connection config
│   ├── github_service.py # GitHub API integration
│   ├── seed.py          # Sample data seeder
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/       # Home, Discover, Login, Dashboard, etc.
│   │   ├── components/  # Navbar, DevlogFeed, ProjectCard, etc.
│   │   ├── hooks/       # useIdentity (auth context)
│   │   ├── api.js       # API client
│   │   ├── App.jsx      # Routes
│   │   └── index.css    # Design system
│   └── package.json
└── README.md
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List users (with skill/semester/dept filters) |
| `POST` | `/api/users` | Register new user |
| `GET` | `/api/users/by-email/{email}` | Login by email |
| `GET` | `/api/users/{id}/projects` | User's posted projects |
| `GET` | `/api/users/{id}/received-applications` | Applications to user's projects |
| `GET` | `/api/users/{id}/my-applications` | Applications by user |
| `GET` | `/api/projects` | List projects |
| `POST` | `/api/projects/{id}/apply` | Apply to project |
| `PATCH` | `/api/applications/{id}` | Accept/reject application |
| `GET` | `/api/github/{username}` | Fetch GitHub profile + skills |
| `POST` | `/api/devlogs` | Post a devlog |
| `GET` | `/api/devlogs` | List devlogs with reaction counts |
| `POST` | `/api/devlogs/{id}/react` | Toggle emoji reaction |
| `GET` | `/api/leaderboard` | Server-side XP leaderboard |

Full interactive docs: [`/docs`](https://dev-match-qcjf.onrender.com/docs) (Swagger UI)

---

## 🆚 Why Not Just Use WhatsApp?

| | WhatsApp Group | Dev-Match |
|---|---|---|
| Find React devs | Spam "anyone knows React?" | Filter by skill in 2 clicks |
| See who's available | No idea | Availability badges |
| GitHub verification | Ask them to send link | Auto-detected, language bars |
| Manage applications | Chat threads get buried | Dashboard with Accept/Reject |
| Track campus activity | Zero visibility | Live devlog feed + leaderboard |

---

## 👥 Team

Built by SLRTCE students, for SLRTCE students.

---

<div align="center">

**⚡ Stop searching WhatsApp groups. Start matching on Dev-Match.**

</div>
