@echo off
chcp 65001 >nul
cd /d "%~dp0"

REM 确保能找到 gh（安装后若提示找不到，请关掉窗口重开一次）
set "PATH=%PATH%;C:\Program Files\GitHub CLI"

where gh >nul 2>&1
if errorlevel 1 (
  echo 未找到 gh 命令。请先安装 GitHub CLI，或重启电脑后再试。
  pause
  exit /b 1
)

echo.
echo ========== 第 1 步：登录 GitHub（会打开浏览器，点授权即可）==========
gh auth login -h github.com -p https -w
if errorlevel 1 (
  echo 登录失败或已取消。
  pause
  exit /b 1
)

echo.
echo ========== 第 2 步：在 GitHub 上新建仓库并推送 ==========
echo 请输入仓库名（只能用英文/数字/横线，例如 game-ux-portfolio）：
set /p REPO_NAME=仓库名: 
if "%REPO_NAME%"=="" (
  echo 未输入仓库名，已退出。
  pause
  exit /b 1
)

gh repo create "%REPO_NAME%" --public --source=. --remote=origin --push
if errorlevel 1 (
  echo.
  echo 若提示 remote origin 已存在，可改用： git push -u origin main
  pause
  exit /b 1
)

for /f "delims=" %%i in ('gh api user -q .login 2^>nul') do set "GH_USER=%%i"

echo.
echo ========== 第 3 步：打开网页，开启 GitHub Pages（只需做一次）==========
echo 1. 点 Settings → 左侧 Pages
echo 2. Build and deployment 里 Source 选「GitHub Actions」
echo 3. 等几分钟，在 Actions 里看到绿色勾后，Pages 页会显示网站地址
echo.
if defined GH_USER start "" "https://github.com/%GH_USER%/%REPO_NAME%/settings/pages"
pause
