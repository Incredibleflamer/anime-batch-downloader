@echo off
setlocal EnableExtensions DisableDelayedExpansion

set "output_cnt=0"
set "currentDir=%CD%"

for /f "delims=" %%b in ('node -v 2^>nul') do set "nodeV=%%b"

if defined nodeV (
    if not exist "%currentDir%\src\node_modules\" (
        start cmd /k "cd /d %currentDir%\src && npm install && node ."
    ) else (
        start cmd /k "cd /d %currentDir%\src && node ."
    )
) else (
    start cmd /k "cd /d %currentDir%\src"
    start https://nodejs.org/en
)

