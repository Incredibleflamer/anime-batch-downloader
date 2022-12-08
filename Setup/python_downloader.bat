@echo OFF
reg Query "HKLM\Hardware\Description\System\CentralProcessor\0" | find /i "x86" > NUL && set OS=32BIT || set OS=64BIT

if %OS%==32BIT explorer "https://www.python.org/ftp/python/3.10.9/python-3.10.9-embed-win32.zip"
if %OS%==64BIT explorer "https://www.python.org/ftp/python/3.10.9/python-3.10.9-embed-amd64.zip"

exit