@echo off
cd /d "%~dp0"
echo NAVION ROBOTICS workshop preview
echo Open http://127.0.0.1:8080 in your browser.
echo Keep this window open. Press Ctrl+C to stop the server.
python -m http.server 8080 --bind 127.0.0.1
pause
