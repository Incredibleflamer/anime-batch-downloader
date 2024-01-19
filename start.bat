@echo off

rem Check if Node.js is installed
where node > nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js not found. Please install Node.js by visiting https://nodejs.org/en/
    start https://nodejs.org/en/
    exit /b 1
)

rem Check if npm is installed
where npm > nul 2>&1
if %errorlevel% neq 0 (
    echo npm not found. Installing npm...
    start https://www.npmjs.com/get-npm
    exit /b 1
)

if exist ".\src\node_modules" (
    cmd "/k cd ./src && node ."
) else (
    echo Node modules not found. Installing dependencies and running the application...
    cmd "/k cd ./src && npm install && node ."
)
