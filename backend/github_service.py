"""GitHub API service — fetches profiles, repos, and auto-detects skills."""
import httpx
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
        # Fetch user profile
        user_resp = await client.get(
            f"{GITHUB_API}/users/{username}",
            headers={"Accept": "application/vnd.github.v3+json"},
            timeout=10,
        )
        if user_resp.status_code != 200:
            return {"error": f"GitHub user '{username}' not found"}

        user_data = user_resp.json()

        # Fetch repos (sorted by updated, top 10)
        repos_resp = await client.get(
            f"{GITHUB_API}/users/{username}/repos",
            params={"sort": "updated", "per_page": 10, "type": "owner"},
            headers={"Accept": "application/vnd.github.v3+json"},
            timeout=10,
        )
        repos_data = repos_resp.json() if repos_resp.status_code == 200 else []

        # Build repos list and detect skills
        all_languages = set()
        detected_skills = set()
        repos = []

        for repo in repos_data:
            if repo.get("fork"):
                continue  # Skip forks

            lang = repo.get("language") or ""
            if lang and lang in LANGUAGE_SKILL_MAP:
                mapped = LANGUAGE_SKILL_MAP[lang]
                if mapped != "HTML/CSS":  # Don't auto-add HTML/CSS, too generic
                    detected_skills.add(mapped)
                all_languages.add(lang)

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

        # Check activity (pushed in last 30 days)
        now = datetime.now(timezone.utc)
        recent_push = any(
            repo.get("pushed_at") and
            (now - datetime.fromisoformat(repo["pushed_at"].replace("Z", "+00:00"))).days < 30
            for repo in repos_data
        )

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
        }

        _set_cache(cache_key, result)
        return result
