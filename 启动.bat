@echo off
chcp 65001 >nul
title Portfolio - 开发模式
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo [需要 Node.js] 请先安装：https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\vite" (
  echo 正在安装依赖…
  call npm install
  if errorlevel 1 ( pause & exit /b 1 )
)

if not exist "node_modules\react" (
  echo 正在补全 React 等依赖…
  call npm install
  if errorlevel 1 ( pause & exit /b 1 )
)

echo 启动中… 关闭本窗口可停止服务。
call npm run dev
pause
