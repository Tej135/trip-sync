@echo off
TITLE TripSync Launcher
echo ===================================================
echo           Starting TripSync Application...
echo ===================================================

:: Navigate to Project Directory
cd /d "%~dp0"

echo [1/3] Starting Backend Server (Port 3000)...
start "TripSync Backend" cmd /k "cd /d %~dp0backend && npm run dev"

:: Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Dev Server (Port 5173)...
start "TripSync Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Wait 2 seconds for Vite to be ready
timeout /t 2 /nobreak >nul

echo [3/3] Opening TripSync in your default browser...
start http://localhost:5173

echo ===================================================
echo  TripSync is now running!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:3000
echo ===================================================
pause
