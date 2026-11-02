@echo off
setlocal enabledelayedexpansion
title EventHub Launcher

echo ======================================================
echo                EventHub App Launcher
echo ======================================================
echo.

:: 1. Verify Node.js and npm are installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not found in your system PATH.
    echo Please ensure npm is configured in your system PATH.
    echo.
    pause
    exit /b 1
)

cd /d "%~dp0"

:: Handle command line arguments if provided
if /i "%~1"=="client" goto START_CLIENT
if /i "%~1"=="frontend" goto START_CLIENT
if /i "%~1"=="both" goto START_BOTH
if /i "%~1"=="all" goto START_BOTH
if /i "%~1"=="install" goto INSTALL_ALL
if /i "%~1"=="build" goto BUILD_CLIENT

:: Interactive menu with 5-second default countdown to start frontend
echo Choose an option:
echo   [1] Start Frontend (Client - React/Vite) [Default]
echo   [2] Start Full Stack (Client + Server in separate windows)
echo   [3] Install Dependencies (Client + Server)
echo   [4] Build Client for Production
echo   [5] Exit
echo.

choice /c 12345 /t 5 /d 1 /m "Select option (1-5, auto-starts [1] in 5s): "
set MENU_CHOICE=%ERRORLEVEL%

if "%MENU_CHOICE%"=="1" goto START_CLIENT
if "%MENU_CHOICE%"=="2" goto START_BOTH
if "%MENU_CHOICE%"=="3" goto INSTALL_ALL
if "%MENU_CHOICE%"=="4" goto BUILD_CLIENT
if "%MENU_CHOICE%"=="5" exit /b 0

:START_CLIENT
echo.
echo ======================================================
echo Starting Client (Vite Dev Server)...
echo ======================================================
cd /d "%~dp0client"
if not exist "node_modules\" (
    echo [INFO] client\node_modules not found. Installing dependencies...
    call npm install
)
call npm run dev
goto END

:START_BOTH
echo.
echo ======================================================
echo Starting Client and Server in separate windows...
echo ======================================================

:: Start Client
cd /d "%~dp0client"
if not exist "node_modules\" (
    echo [INFO] Installing client dependencies...
    call npm install
)
start "EventHub - Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"

:: Start Server
cd /d "%~dp0server"
if not exist "node_modules\" (
    echo [INFO] Installing server dependencies...
    call npm install
)
start "EventHub - Backend" cmd /k "cd /d "%~dp0server" && node server.js"

echo.
echo Both Frontend and Backend windows have been launched.
echo You can close this window now.
goto END

:INSTALL_ALL
echo.
echo ======================================================
echo Installing Dependencies...
echo ======================================================
echo Installing client dependencies...
cd /d "%~dp0client"
call npm install

echo.
echo Installing server dependencies...
cd /d "%~dp0server"
call npm install

echo.
echo [SUCCESS] All dependencies installed successfully.
pause
goto END

:BUILD_CLIENT
echo.
echo ======================================================
echo Building Client for Production...
echo ======================================================
cd /d "%~dp0client"
call npm run build
pause
goto END

:END
