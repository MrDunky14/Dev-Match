@echo off
title Dev-Match Launcher
echo.
echo  Dev-Match  Starting...
echo  ========================================
echo.

:: Start Backend (relative path from repo root)
echo  [1/2] Starting Backend (FastAPI on port 8000)...
start "Dev-Match Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --reload --port 8000"

:: Give backend a moment to boot
timeout /t 3 /nobreak > nul

:: Start Frontend
echo  [2/2] Starting Frontend (Vite on port 5173)...
start "Dev-Match Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Wait and open browser
timeout /t 4 /nobreak > nul
echo.
echo  Both servers are running!
echo  -----------------------------------------
echo  Backend API : http://localhost:8000
echo  Frontend    : http://localhost:5173
echo  -----------------------------------------
echo.
echo  Opening browser...
start http://localhost:5173
echo  Close this window anytime. To stop servers, close their terminal windows.
pause
