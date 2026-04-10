# Create directories
New-Item -ItemType Directory -Force -Path "src/assets/images/avatars"
New-Item -ItemType Directory -Force -Path "src/assets/images/illustrations"
New-Item -ItemType Directory -Force -Path "src/assets/fonts"
New-Item -ItemType Directory -Force -Path "src/assets/icons"

# Create logo.svg
$logoSvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <rect width="200" height="60" fill="#3b82f6" rx="8"/>
  <text x="30" y="42" font-size="32" fill="white" font-family="Arial" font-weight="bold">ZEDU</text>
</svg>
'@
Set-Content -Path "src/assets/images/logo.svg" -Value $logoSvg

# Create hero.svg
$heroSvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#f0f9ff"/>
  <circle cx="200" cy="250" r="40" fill="#3b82f6" opacity="0.2"/>
  <circle cx="300" cy="200" r="50" fill="#3b82f6" opacity="0.3"/>
  <circle cx="400" cy="280" r="60" fill="#3b82f6" opacity="0.4"/>
  <text x="300" y="520" font-size="48" fill="#1e40af" font-family="Arial" font-weight="bold">Education</text>
  <text x="320" y="570" font-size="48" fill="#2563eb" font-family="Arial" font-weight="bold">For All</text>
</svg>
'@
Set-Content -Path "src/assets/images/hero.svg" -Value $heroSvg

# Create avatar files
$defaultAvatar = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="#e2e8f0"/>
  <circle cx="50" cy="35" r="15" fill="#94a3b8"/>
  <path d="M20 75 Q50 90, 80 75" stroke="#64748b" stroke-width="8" fill="none"/>
</svg>
'@
Set-Content -Path "src/assets/images/avatars/default-avatar.svg" -Value $defaultAvatar

$studentAvatar = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="#dbeafe"/>
  <circle cx="50" cy="35" r="15" fill="#3b82f6"/>
  <path d="M20 75 Q50 90, 80 75" stroke="#1e40af" stroke-width="8" fill="none"/>
</svg>
'@
Set-Content -Path "src/assets/images/avatars/student-avatar.svg" -Value $studentAvatar

$tutorAvatar = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="#fef3c7"/>
  <circle cx="50" cy="35" r="15" fill="#d97706"/>
  <path d="M20 75 Q50 90, 80 75" stroke="#b45309" stroke-width="8" fill="none"/>
</svg>
'@
Set-Content -Path "src/assets/images/avatars/tutor-avatar.svg" -Value $tutorAvatar

# Create illustration files
$onlineLearning = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="white"/>
  <rect x="100" y="100" width="200" height="120" rx="10" fill="#e2e8f0"/>
  <rect x="120" y="120" width="160" height="80" fill="#1e293b"/>
  <circle cx="200" cy="160" r="20" fill="#3b82f6"/>
</svg>
'@
Set-Content -Path "src/assets/images/illustrations/online-learning.svg" -Value $onlineLearning

$dashboard = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="white"/>
  <rect x="50" y="50" width="120" height="80" rx="8" fill="#3b82f6" opacity="0.2"/>
  <rect x="190" y="50" width="120" height="80" rx="8" fill="#10b981" opacity="0.2"/>
  <path d="M60 180 L90 150 L120 170 L150 130 L180 150" stroke="#3b82f6" stroke-width="3" fill="none"/>
</svg>
'@
Set-Content -Path "src/assets/images/illustrations/dashboard.svg" -Value $dashboard

# Create font CSS
$fontCss = @'
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  src: url('./inter.ttf') format('truetype');
}
'@
Set-Content -Path "src/assets/fonts/inter.css" -Value $fontCss

# Create icon files
$menuIcon = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M3 12h18M3 6h18M3 18h18"/>
</svg>
'@
Set-Content -Path "src/assets/icons/menu.svg" -Value $menuIcon

$closeIcon = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M18 6L6 18M6 6l12 12"/>
</svg>
'@
Set-Content -Path "src/assets/icons/close.svg" -Value $closeIcon

$dashboardIcon = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="3" y="3" width="7" height="9" rx="1"/>
  <rect x="14" y="3" width="7" height="5" rx="1"/>
  <rect x="14" y="12" width="7" height="9" rx="1"/>
  <rect x="3" y="16" width="7" height="5" rx="1"/>
</svg>
'@
Set-Content -Path "src/assets/icons/dashboard.svg" -Value $dashboardIcon

$studentsIcon = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="9" cy="8" r="4"/>
  <path d="M5 18v-2a4 4 0 0 1 8 0v2"/>
  <circle cx="17" cy="8" r="4"/>
  <path d="M13 18v-2a4 4 0 0 1 8 0v2"/>
</svg>
'@
Set-Content -Path "src/assets/icons/students.svg" -Value $studentsIcon

Write-Host "✅ All asset files created successfully!" -ForegroundColor Green
Write-Host "Location: src/assets/" -ForegroundColor Yellow