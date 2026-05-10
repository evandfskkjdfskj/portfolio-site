@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在推送到 GitHub（需要能访问 github.com）...
git push origin main
if errorlevel 1 (
  echo.
  echo 推送失败。常见原因：网络不稳定、需开 VPN、或公司/校园网拦截。
  echo 可换手机热点再双击本文件，或安装 GitHub Desktop 后点 Push origin。
  pause
  exit /b 1
)
echo.
echo 推送成功。请打开仓库 Actions 等绿色勾后再刷新网站。
pause
