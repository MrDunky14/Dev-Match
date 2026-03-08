<div align="center">

# Dev-Match

### Campus Developer Matching Platform

*Find your perfect dev teammate — by skill, semester, and verified GitHub activity.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vite.dev)

</div>

---

## 🌟 Overview

Dev-Match is a **campus-exclusive developer matching platform** designed to solve the "teammate search" chaos. Built with a premium dark-mode aesthetic, it allows students to discover collaborators based on verified skills, department, and semester.

---

## ✨ Features

| Group | Feature | Description |
|---|---|---|
| 🔐 **Auth** | **Verified Profiles** | Email-restricted to `@slrtce.in` for a safe campus environment. |
| 🐙 **GitHub** | **Verified Check** | Official "Verified" badges for users with confirmed GitHub OAuth. |
| 🔍 **Discovery** | **Smart Filters** | Search devs by Sem 1-8, Tech Stack (React, Python, etc.), and Dept. |
| 💬 **Social** | **Live Feed** | A real-time campus devlog to share progress & react with emojis. |
| 🛠️ **Projects** | **Help Wanted** | Post project ideas, manage applications, and assemble teams. |
| 📈 **Gamified** | **XP & Ranks** | Level up from *Novice* to *Architect* based on your contributions. |
| 🗂️ **Toolkit** | **Resourced** | Personalized learning paths and trending campus skills. |

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite 7, Framer Motion, Lucide Icons
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy 2.0, Passlib (Bcrypt)
- **Database**: PostgreSQL (Supabase) / SQLite for local development
- **Auth**: JWT (Stateless) + GitHub OAuth 2.0

---

## 📂 Project Structure

```
Dev-Match/
├── backend/
│   ├── main.py             # FastAPI entrypoint & 40+ API routes
│   ├── models.py           # Database models
│   ├── crud.py             # Logic for XP, matching, and DB ops
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/          # Feed, Discover, Profile, Dashboard, etc.
│   │   ├── components/     # Navbar, ProfileCard, DevlogFeed, etc.
│   │   └── api.js          # Centralized Axios client with JWT
│   └── package.json        # Frontend dependencies
├── start.py                # Combined launcher
└── README.md
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Set your DATABASE_URL, SECRET_KEY, and GITHUB credentials
python -m uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Open the App
Navigate to `http://localhost:5173`. You must login/register with an `@slrtce.in` email to participate.

---

## 🌍 Deployment

- **Database**: Host on [Supabase](https://supabase.com).
- **Backend**: Deploy on Render/Railway.
- **Frontend**: Deploy on Vercel.

---

<div align="center">

**Stop searching WhatsApp. Start matching on Dev-Match.**

</div>
