<div align="center">

# Dev-Match

### Campus Developer Matching Platform

*Find your perfect dev teammate — by skill, semester, and GitHub activity.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vite.dev)

</div>

---

## What is Dev-Match?

Dev-Match is a **campus developer matching platform** that replaces the "anyone knows React?" WhatsApp chaos with a proper skill-based team discovery system. Students can find teammates by **skill, semester, department**, and **verified GitHub activity**.

---

## Features

| Feature | Description |
|---|---|
| **Smart Discovery** | Filter developers by skill, semester, department, availability |
| **GitHub Integration** | Auto-detect skills, language breakdown bars, latest commits |
| **Live Devlog Feed** | Share what you're building, react with emojis |
| **Project Board** | Post projects, apply with one click, manage applications |
| **XP Leaderboard** | Server-side XP from projects, devlogs, community activity, GitHub |
| **Rank Titles** | Novice / Builder / Architect / Titan based on XP |
| **Skill Endorsements** | Endorse teammates' skills to build credibility |
| **Team Formation** | Accept applicants, view your team per project |
| **Dashboard** | Manage projects, applications, and team members |
| **Compatibility Score** | See match percentage based on complementary skills |
| **Notifications** | Real-time alerts for applications, endorsements, messages |
| **Dev Toolkit** | Personalized learning paths, trending skills, resources |
| **Notice Board** | Campus announcements tagged by type |
| **Direct Messaging** | In-app messaging between developers |
| **Profile System** | Rich profiles with skills, bio, avatar, GitHub link |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, React Router 7, Axios, Framer Motion, Lucide Icons |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0, Pydantic v2 |
| **Database** | PostgreSQL via Supabase (SQLite for local dev) |
| **Auth** | JWT (python-jose) + bcrypt password hashing |
| **External API** | GitHub REST API v3 |

---

## Project Structure

```
Dev-Match/
├── backend/
│   ├── main.py             # FastAPI app + all 41 API routes
│   ├── models.py           # SQLAlchemy ORM models
│   ├── schemas.py          # Pydantic request/response schemas
│   ├── crud.py             # Database operations + XP algorithm
│   ├── auth.py             # JWT + password hashing
│   ├── database.py         # DB connection (Supabase/SQLite)
│   ├── github_service.py   # GitHub API integration
│   ├── seed.py             # Sample data seeder
│   ├── migrate.py          # DB migration script
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── pages/          # 12 pages (Home, Discover, Dashboard, etc.)
│   │   ├── components/     # Shared components (Navbar, ProfileCard, etc.)
│   │   ├── hooks/          # useIdentity (auth context)
│   │   ├── api.js          # Axios client with JWT + caching
│   │   ├── App.jsx         # Client-side routing
│   │   └── index.css       # Design system (CSS variables)
│   ├── .env.example        # Frontend env template
│   └── package.json
├── start.py                # Cross-platform launcher
├── start.bat               # Windows launcher
├── .gitignore
└── README.md
```

---

## Quick Start (Local Development)

### Prerequisites

- Python 3.9+
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works) **OR** SQLite for local dev

### 1. Clone the repo

```bash
git clone https://github.com/MrDunky14/Dev-Match.git
cd Dev-Match
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# For local dev with SQLite (no setup needed):
DATABASE_URL=sqlite:///./sql_app.db

# For Supabase PostgreSQL (see Supabase Setup section below):
# DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

SECRET_KEY=your-random-secret-key-here
GITHUB_TOKEN=your-github-token-optional
```

Start the backend:

```bash
python -m uvicorn main:app --reload --port 8000
```

> The database schema auto-creates on first run. Sample data auto-seeds if the database is empty.

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Optionally create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the dev server:

```bash
npm run dev
```

### 4. Open the app

Go to [http://localhost:5173](http://localhost:5173)

> **Shortcut**: Run `python start.py` from the repo root to launch both servers at once.

---

## Supabase Database Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose an organization, set a **database password** (save this!), and pick a region
4. Wait for the project to provision

### Step 2: Get the Connection String

1. In your Supabase dashboard, go to **Project Settings** (gear icon) → **Database**
2. Scroll to **Connection string** → select **URI** tab
3. Copy the **Transaction** pooler connection string (port `6543`)
4. It looks like:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the database password you set earlier

### Step 3: Configure the Backend

Add the connection string to your `backend/.env`:

```env
DATABASE_URL=postgresql://postgres.abcdefghijk:MySecurePassword123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
SECRET_KEY=generate-a-random-64-char-string
```

> Generate a secret key: `python -c "import secrets; print(secrets.token_urlsafe(64))"`

### Step 4: Initialize the Database

```bash
cd backend
python -m uvicorn main:app --port 8000
```

SQLAlchemy's `create_all()` will automatically create all tables on the first run. The auto-seeder will populate sample data if the database is empty.

### Step 5: Verify

Open [http://localhost:8000/docs](http://localhost:8000/docs) — you should see the Swagger UI with all 41 endpoints.

---

## Deploying to Production

### Backend (Render / Railway / Any Python host)

1. Push the repo to GitHub
2. Create a new **Web Service** on your host
3. Set the **Build Command**: `pip install -r requirements.txt`
4. Set the **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables:
   - `DATABASE_URL` — your Supabase connection string
   - `SECRET_KEY` — a strong random string
   - `GITHUB_TOKEN` — (optional) GitHub personal access token
   - `CORS_ORIGINS` — your frontend URL (e.g., `https://dev-match.vercel.app`)

### Frontend (Vercel)

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_URL` — your deployed backend URL + `/api` (e.g., `https://dev-match-api.onrender.com/api`)
6. Deploy

---

## API Overview

41 endpoints across 10 resource groups:

| Group | Endpoints | Auth |
|---|---|---|
| **Auth** | `POST /register`, `POST /login`, `GET /me` | Public / Protected |
| **Users** | CRUD + filters by skill/semester/department | Mixed |
| **Projects** | CRUD + status filtering | Protected writes |
| **Applications** | Apply, accept/reject, list by user/project | Protected |
| **Messages** | Send, list conversations | Protected |
| **Devlogs** | Create, list feed, toggle emoji reactions | Protected writes |
| **Announcements** | Create, list with type filter | Protected writes |
| **Leaderboard** | XP ranking with rank titles | Public |
| **Notifications** | List, count, mark read | Protected |
| **Endorsements** | Toggle skill endorsements | Protected |

Full interactive docs available at `/docs` (Swagger UI) when the backend is running.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `sqlite:///./sql_app.db` | PostgreSQL connection string (Supabase) |
| `SECRET_KEY` | Yes | `dev-match-secret-...` | JWT signing secret (change in production!) |
| `GITHUB_TOKEN` | No | — | GitHub PAT for higher API rate limits |
| `CORS_ORIGINS` | No | localhost + vercel | Comma-separated allowed origins |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `http://localhost:8000/api` | Backend API base URL |

---

## XP System

| Activity | Points | Cap |
|---|---|---|
| Profile completeness | varies | 50 |
| Skills added | 5 each | 40 |
| Projects posted | 20 each | 60 |
| Devlogs written | 10 each | 40 |
| Community (messages + announcements) | combined | 40 |
| GitHub repos | 2 each | 25 |
| GitHub followers | 3 each | 15 |
| Active GitHub status | +15 | 15 |

**Rank Titles**: Novice (< 100 XP) → Builder (100-249) → Architect (250-449) → Titan (450+)

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Stop searching WhatsApp groups. Start matching on Dev-Match.**

</div>
