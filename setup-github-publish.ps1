# 作品集发布助手：构建 + 本地 Git 提交 +（可选）推送到 GitHub
# 用法：
#   1) 仅打包提交：  .\setup-github-publish.ps1
#   2) 并推送：      .\setup-github-publish.ps1 https://github.com/你的用户名/仓库名.git
#
# 首次推送前请在浏览器新建空仓库：https://github.com/new （不要勾选 README）
# 推送后：仓库 Settings → Pages → Build and deployment → Source 选「GitHub Actions」

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host "== 1/4 安装依赖并构建 ==" -ForegroundColor Cyan
if (-not (Test-Path "package-lock.json")) {
  Write-Host "缺少 package-lock.json，正在 npm install..." -ForegroundColor Yellow
  npm install
}
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "== 2/4 初始化 Git（若尚未初始化）==" -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
  git init
  git branch -M main
}

Write-Host "== 3/4 提交更改 ==" -ForegroundColor Cyan
git add -A
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
  Write-Host "没有新更改需要提交。" -ForegroundColor Yellow
} else {
  git commit -m "chore: build portfolio for GitHub Pages"
}

$RemoteUrl = $args[0]
if ($RemoteUrl) {
  Write-Host "== 4/4 推送到 GitHub ==" -ForegroundColor Cyan
  $hasOrigin = git remote get-url origin 2>$null
  if ($LASTEXITCODE -ne 0) {
    git remote add origin $RemoteUrl
  } else {
    git remote set-url origin $RemoteUrl
  }
  git push -u origin main
  if ($LASTEXITCODE -ne 0) {
    Write-Host "`n若提示未登录，请先安装 GitHub CLI 并执行: gh auth login" -ForegroundColor Yellow
    Write-Host "或用 GitHub Desktop：File → Add local repository → 选本文件夹 → Publish repository`n" -ForegroundColor Yellow
    exit $LASTEXITCODE
  }
  Write-Host "`n完成。请到 GitHub 打开该仓库 → Settings → Pages → Source 选「GitHub Actions」。" -ForegroundColor Green
  Write-Host "几分钟后 Actions 跑完即可访问（仓库右侧 Environments / Actions 里可看网址）。`n" -ForegroundColor Green
} else {
  Write-Host "`n== 下一步（需要你手动做一次）==" -ForegroundColor Green
  Write-Host "1. 浏览器打开 https://github.com/new 新建仓库，名称随意，不要勾选 README。" -ForegroundColor White
  Write-Host "2. 在本文件夹 PowerShell 里执行（把地址换成你的）：" -ForegroundColor White
  Write-Host "   .\setup-github-publish.ps1 https://github.com/你的用户名/仓库名.git" -ForegroundColor Cyan
  Write-Host "`n若 push 失败：安装 GitHub Desktop https://desktop.github.com/ ，添加本文件夹后点 Publish repository 即可。`n" -ForegroundColor Yellow
}
