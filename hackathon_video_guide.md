# Dev-Match — Hackathon Video Presentation Guide

A step-by-step guide to record a winning 3–5 minute demo video.

---

## 🎬 Recommended Structure

| Section | Duration | What to Show |
|---------|----------|-------------|
| **Hook** | 0:00 – 0:20 | State the problem |
| **Solution** | 0:20 – 0:40 | Introduce Dev-Match |
| **Live Demo** | 0:40 – 3:30 | Walk through every feature |
| **Tech Stack** | 3:30 – 4:00 | Architecture overview |
| **Impact** | 4:00 – 4:30 | Why it matters |

---

## 🎙️ Script Outline

### 1. Hook (20 sec)
> *"How many great project ideas have died because you couldn't find a teammate with the right skills? You know React, but you need a Firebase expert. You're in 6th semester CS, but the perfect partner is in IT department — and you don't even know they exist."*

### 2. Introduce the Solution (20 sec)
> *"That's why we built Dev-Match — a Tinder for Developers inside the campus. It lets students create skill profiles, discover teammates, and post projects that need help."*

### 3. Live Demo (2–3 min)
Walk through each page **in order**:

#### a) Home Page (~20 sec)
- Show the landing page with stats
- Say: *"Right now we have X developers, Y active projects, across Z skills."*
- Scroll to show "How It Works"

#### b) Create a Profile (~30 sec)
- Navigate to **Join** → Fill the form live
- Pick skills by clicking the pills
- Add a custom skill
- Submit → show the success animation
- Say: *"It takes less than a minute to get listed."*

#### c) Discover Developers (~40 sec) — **THE STAR FEATURE**
- Navigate to **Discover**
- Show the full grid of developer cards
- **Demo the filter system** — this is your key feature:
  - Filter by **Skill** → click "React" → show results narrow down
  - Filter by **Semester** → click "6" → show cross-filtering
  - Filter by **Department** → select "Data Science"
  - Reset and search by **name**
- Say: *"You can find exactly who you need in seconds."*

#### d) Help Wanted Board (~30 sec)
- Navigate to **Projects**
- Show project cards with skills needed and roles
- Filter by skill
- Say: *"If you have a project idea, post it. If you're looking to join one, browse the board."*

#### e) Post a Project (~20 sec)
- Navigate to **Post Project**
- Quickly fill the form
- Show skill and role pickers
- Submit → success animation

### 4. Tech Stack Slide (30 sec)
Show or say:
> *"Built with React + Vite on the frontend for a fast, dynamic UI. FastAPI + SQLite on the backend for a lightweight, powerful API. Full REST architecture with real-time filtering."*

Mention these strengths:
- ⚡ **Fast** — Vite's instant HMR + FastAPI's async performance
- 🎨 **Premium UI** — Glassmorphism, micro-animations, dark theme
- 🔍 **Powerful filters** — Multi-parameter search (skill × semester × department)
- 📱 **Responsive** — Works on mobile with bottom navigation

### 5. Impact & Closing (30 sec)
> *"No good project idea should die because a student couldn't find a partner. Dev-Match makes sure the right people find each other — inside the campus."*

---

## 🎥 Recording Tips

### Setup
- Use **OBS Studio** (free) or **Windows Game Bar** (`Win + G`) to record
- Set resolution to **1920×1080** or **1280×720**
- Use a **clean browser** (no bookmarks bar, no extra tabs)
- **Close notifications** on your OS

### During Recording
- **Go slow** — don't rush through clicks, let each page load fully
- **Narrate everything** — don't assume the viewer sees what you see
- **Zoom in** on filter results when they change (use `Ctrl + =`)
- **Pause for 1–2 seconds** after each major action so viewers can process

### Audio
- Use a headset mic or phone mic close to your mouth
- Record in a quiet room
- If your accent is strong, speak slightly slower and enunciate

### Post-Production (Optional but Impressive)
- Add a title card at the start: **"Dev-Match — The Internal Team Finder"**
- Use **CapCut** (free) or **DaVinci Resolve** (free) for editing
- Add subtle background music (lo-fi or ambient, very low volume)
- Add text callouts when demonstrating filters

---

## ✅ Pre-Recording Checklist

- [ ] Backend running: `python -m uvicorn main:app --reload --port 8000`
- [ ] Frontend running: `npm run dev`
- [ ] Database freshly seeded: `python seed.py` (for clean demo data)
- [ ] Browser at `http://localhost:5173` — zoom to 100%
- [ ] No browser extensions visible
- [ ] Notifications silenced
- [ ] Script rehearsed at least once out loud
