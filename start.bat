@echo off
title MATLAB-Lite Control Systems IDE

echo.
echo ============================================================
echo    MATLAB-Lite Control Systems IDE
echo ============================================================
echo.

echo [1/2] Installing dependencies...
pip install flask flask-cors numpy control matplotlib --quiet

echo.
echo [2/2] Starting server...
echo.
echo    Open http://localhost:5000 in your browser
echo    Press Ctrl+C to stop the server
echo.
echo ============================================================
echo.

start http://localhost:5000
python server.py

pause
