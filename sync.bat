@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ==============================
echo       正在同步网站...
echo ==============================
echo.

git add .

git commit -m "Update website"

if errorlevel 1 (
    echo.
    echo 没有新的修改，或者提交失败。
    pause
    exit /b
)

echo.
echo 正在上传到 GitHub...
git push origin main

echo.
echo ==============================
echo       同步完成！
echo ==============================
echo.
pause