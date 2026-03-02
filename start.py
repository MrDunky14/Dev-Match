"""
Dev-Match — Cross-platform launcher
Usage: python start.py
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"

def main():
    print()
    print("  ⚡ Dev-Match — Starting...")
    print("  " + "═" * 42)
    print()

    # 1) Backend
    print("  [1/2] Starting Backend (FastAPI on port 8000)...")
    backend = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--reload", "--port", "8000"],
        cwd=BACKEND,
        creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == "nt" else 0,
    )

    time.sleep(3)

    # 2) Frontend
    print("  [2/2] Starting Frontend (Vite on port 5173)...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=FRONTEND,
        creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == "nt" else 0,
    )

    time.sleep(4)

    print()
    print("  ✅ Both servers are running!")
    print("  " + "─" * 42)
    print("  Backend API : http://localhost:8000")
    print("  Frontend    : http://localhost:5173")
    print("  " + "─" * 42)
    print()

    webbrowser.open("http://localhost:5173")

    print("  Press Ctrl+C to stop both servers.")
    print()

    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        print("\n  Shutting down...")
        backend.terminate()
        frontend.terminate()
        backend.wait()
        frontend.wait()
        print("  ✅ Stopped.")

if __name__ == "__main__":
    main()
