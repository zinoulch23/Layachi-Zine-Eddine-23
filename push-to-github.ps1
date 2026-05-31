# Creates github.com/YOUR_USERNAME/zinou-app and uploads this project.
$ErrorActionPreference = "Stop"
$git = "D:\MinGit\cmd\git.exe"
$gh  = "D:\GitHubCLI\bin\gh.exe"
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Set-Location -LiteralPath $repoRoot

Write-Host "`n=== Push zinou-app to GitHub ===" -ForegroundColor Cyan

& $gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nStep 1: Sign in to GitHub in your browser..." -ForegroundColor Yellow
    Start-Process "https://github.com/login/device"
    & $gh auth login --hostname github.com --git-protocol https --web
    if ($LASTEXITCODE -ne 0) { throw "GitHub login failed." }
}

$user = & $gh api user -q .login
Write-Host "`nSigned in as: $user" -ForegroundColor Green

& $git branch -M main

$remote = & $git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "Creating repository and pushing..." -ForegroundColor Cyan
    & $gh repo create zinou-app --public --source=. --remote=origin --push
} else {
    Write-Host "Pushing to existing remote..." -ForegroundColor Cyan
    & $git push -u origin main
}

if ($LASTEXITCODE -ne 0) { throw "Push failed." }

$url = "https://github.com/$user/zinou-app"
Write-Host "`nDone! Open this link in your browser (address bar, NOT search):" -ForegroundColor Green
Write-Host $url -ForegroundColor White
Start-Process $url
