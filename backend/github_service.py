"""GitHub API service — fetches profiles, repos, and auto-detects skills."""
import httpx
import asyncio
from datetime import datetime, timedelta, timezone
from typing import Optional

# Simple in-memory cache (resets on server restart — fine for our scale)
_cache: dict[str, tuple[dict, datetime]] = {}
CACHE_TTL = timedelta(hours=24)

GITHUB_API = "https://api.github.com"

# Language → Skill mapping
LANGUAGE_SKILL_MAP = {
    "JavaScript": "JavaScript",
    "TypeScript": "TypeScript",
    "Python": "Python",
    "Java": "Java",
    "Kotlin": "Kotlin",
    "Dart": "Flutter",
    "Swift": "Swift",
    "Go": "Go",
    "Rust": "Rust",
    "C++": "C++",
    "C": "C",
    "C#": "C#",
    "Ruby": "Ruby",
    "PHP": "PHP",
    "HTML": "HTML/CSS",
    "CSS": "HTML/CSS",
    "SCSS": "HTML/CSS",
    "Shell": "Linux/Shell",
    "Dockerfile": "Docker",
    "HCL": "Terraform",
    "Jupyter Notebook": "Python/ML",
    "Solidity": "Solidity",
    "Vue": "Vue.js",
}

# Detect frameworks from repo names/descriptions
FRAMEWORK_KEYWORDS = {
    "react": "React",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "vue": "Vue.js",
    "angular": "Angular",
    "django": "Django",
    "flask": "Flask",
    "fastapi": "FastAPI",
    "express": "Express.js",
    "node": "Node.js",
    "firebase": "Firebase",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "flutter": "Flutter",
    "mongodb": "MongoDB",
    "postgres": "PostgreSQL",
    "redis": "Redis",
    "aws": "AWS",
    "tailwind": "Tailwind CSS",
}


def _get_cached(key: str) -> Optional[dict]:
    if key in _cache:
        data, expires = _cache[key]
        if datetime.now(timezone.utc) < expires:
            return data
        del _cache[key]
    return None


def _set_cache(key: str, data: dict):
    _cache[key] = (data, datetime.now(timezone.utc) + CACHE_TTL)


async def fetch_github_profile(username: str) -> dict:
    """Fetch a GitHub user's profile, repos, and detect skills."""
    cache_key = f"github:{username}"
    cached = _get_cached(cache_key)
    if cached:
        return cached

    async with httpx.AsyncClient() as client:
        # Fetch user profile and repos concurrently to half the delay time
        user_req = client.get(
            f"{GITHUB_API}/users/{username}",
            headers={"Accept": "application/vnd.github.v3+json"},
            timeout=10,
        )
        repos_req = client.get(
            f"{GITHUB_API}/users/{username}/repos",
            params={"sort": "updated", "per_page": 10, "type": "owner"},
            headers={"Accept": "application/vnd.github.v3+json"},
            timeout=10,
        )
        
        user_resp, repos_resp = await asyncio.gather(user_req, repos_req, return_exceptions=True)
        
        # Prevent crashes if requests fail completely
        if isinstance(user_resp, Exception) or user_resp.status_code == 403 or user_resp.status_code == 429:
             print(f"⚠️ GitHub API rate limit hit for {username}")
             # Return fallback profile data so the UI doesn't break
             fallback_result = {
                "username": username,
                "name": username,
                "avatar_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}",
                "bio": "GitHub stats currently unavailable due to API rate limits.",
                "public_repos": 0,
                "followers": 0,
                "repos": [],
                "detected_skills": ["Rate Limited"],
                "recently_active": False,
                "language_breakdown": [],
                "latest_commit": "Unavailable right now"
             }
             _set_cache(cache_key, fallback_result)
             return fallback_result
             
        if user_resp.status_code != 200:
            return {"error": f"GitHub user '{username}' not found"}

        user_data = user_resp.json()

        # Parse repos response
        repos_data = []
        if not isinstance(repos_resp, Exception) and repos_resp.status_code == 200:
            repos_data = repos_resp.json()

        # Build repos list and detect skills
        all_languages = {}  # language -> repo count for breakdown
        detected_skills = set()
        repos = []

        for repo in repos_data:
            if repo.get("fork"):
                continue  # Skip forks

            lang = repo.get("language") or ""
            if lang:
                all_languages[lang] = all_languages.get(lang, 0) + 1
                if lang in LANGUAGE_SKILL_MAP:
                    mapped = LANGUAGE_SKILL_MAP[lang]
                    if mapped != "HTML/CSS":  # Don't auto-add HTML/CSS, too generic
                        detected_skills.add(mapped)

            # Detect frameworks from repo name + description
            searchable = f"{repo.get('name', '')} {repo.get('description', '')}".lower()
            for keyword, skill in FRAMEWORK_KEYWORDS.items():
                if keyword in searchable:
                    detected_skills.add(skill)

            repos.append({
                "name": repo.get("name", ""),
                "description": repo.get("description") or "",
                "language": lang,
                "stars": repo.get("stargazers_count", 0),
                "url": repo.get("html_url", ""),
                "updated_at": repo.get("updated_at", ""),
            })

        # Sort repos: stars desc, then recently updated
        repos.sort(key=lambda r: (-r["stars"], r["updated_at"]), reverse=False)

        # Compute language breakdown as percentages
        total_lang_repos = sum(all_languages.values()) or 1
        language_breakdown = [
            {"language": lang, "percentage": round(count / total_lang_repos * 100)}
            for lang, count in sorted(all_languages.items(), key=lambda x: -x[1])
        ][:6]  # Top 6 languages

        # Check activity (pushed in last 30 days)
        now = datetime.now(timezone.utc)
        recent_push = any(
            repo.get("pushed_at") and
            (now - datetime.fromisoformat(repo["pushed_at"].replace("Z", "+00:00"))).days < 30
            for repo in repos_data
        )

        # Fetch latest commit from events API (lightweight, best-effort)
        latest_commit = ""
        try:
            events_resp = await client.get(
                f"{GITHUB_API}/users/{username}/events",
                params={"per_page": 10},
                headers={"Accept": "application/vnd.github.v3+json"},
                timeout=5,
            )
            if events_resp.status_code == 200:
                for event in events_resp.json():
                    if event.get("type") == "PushEvent":
                        commits = event.get("payload", {}).get("commits", [])
                        if commits:
                            latest_commit = commits[-1].get("message", "")
                            break
        except Exception:
            pass  # Events are optional, don't break the profile

        result = {
            "username": username,
            "name": user_data.get("name") or username,
            "avatar_url": user_data.get("avatar_url", ""),
            "bio": user_data.get("bio") or "",
            "public_repos": user_data.get("public_repos", 0),
            "followers": user_data.get("followers", 0),
            "repos": repos[:5],  # Top 5
            "detected_skills": sorted(list(detected_skills)),
            "recently_active": recent_push,
            "language_breakdown": language_breakdown,
            "latest_commit": latest_commit,
        }

        _set_cache(cache_key, result)
        return result
