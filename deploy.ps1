param (
    [string]$CommitMessage = "Update SientoOps OS"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 SientoOps Cloudflare CI/CD Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if there are changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "⚠️ No changes detected. Everything is up to date." -ForegroundColor Yellow
    exit 0
}

Write-Host "📦 Staging changes..." -ForegroundColor Blue
git add .

Write-Host "💾 Committing changes with message: '$CommitMessage'..." -ForegroundColor Blue
git commit -m $CommitMessage

Write-Host "🌐 Pushing to GitHub (This will trigger Cloudflare build)..." -ForegroundColor Blue
git push origin main

Write-Host "✅ Deployment pushed successfully! Check Cloudflare dashboard for build status." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
