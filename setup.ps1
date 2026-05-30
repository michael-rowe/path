#Requires -Version 5.1
<#
.SYNOPSIS
    Path portfolio app — Windows setup script
.DESCRIPTION
    Downloads and starts the Path portfolio app using Docker Desktop.
    Run via setup.bat (double-click) rather than directly.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoUrl      = "https://github.com/michael-rowe/path.git"
$DefaultDir   = Join-Path $env:USERPROFILE "path"
$Port         = 3000
$AppUrl       = "http://localhost:$Port"
$DockerExe    = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
$DockerDlUrl  = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"

# ── Helpers ───────────────────────────────────────────────────────────────────
function Write-Ok      { param([string]$Msg) Write-Host "[OK]   $Msg" -ForegroundColor Green }
function Write-Info    { param([string]$Msg) Write-Host "[..]   $Msg" -ForegroundColor Cyan }
function Write-Warn    { param([string]$Msg) Write-Host "[!]    $Msg" -ForegroundColor Yellow }
function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host $Title -ForegroundColor White
    Write-Host ("-" * 50)
}
function Exit-Error {
    param([string]$Msg)
    Write-Host ""
    Write-Host "[ERR]  $Msg" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

function Test-DockerRunning {
    try {
        $null = & docker info 2>&1
        return ($LASTEXITCODE -eq 0)
    } catch {
        return $false
    }
}

function ConvertFrom-SecureStringPlain {
    param([System.Security.SecureString]$Secure)
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
    try { return [Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

# ── Welcome ───────────────────────────────────────────────────────────────────
Clear-Host
Write-Host ""
Write-Host "Path -- portfolio setup" -ForegroundColor White
Write-Host ("-" * 50)
Write-Host ""
Write-Host "This script will:"
Write-Host "  1. Check that Docker Desktop is installed and running"
Write-Host "  2. Download Path from GitHub"
Write-Host "  3. Ask for your login credentials"
Write-Host "  4. Start the app and open it in your browser"
Write-Host ""
Write-Host "First install takes about 5-10 minutes (mostly image download)."
Write-Host ""
Read-Host "Press Enter to continue, or close this window to cancel"

# ── Step 1: git ───────────────────────────────────────────────────────────────
Write-Section "1 of 6  --  Git"
if ($null -ne (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Ok "Git is installed"
} else {
    Write-Warn "Git is not installed."
    Write-Host ""
    Write-Host "  Download Git for Windows from: https://git-scm.com/download/win"
    Write-Host "  Install it, then re-run this script."
    Write-Host ""
    $open = Read-Host "Open the download page now? [Y/n]"
    if ($open -ne "n" -and $open -ne "N") {
        Start-Process "https://git-scm.com/download/win"
    }
    Exit-Error "Git is required. Install it and re-run this script."
}

# ── Step 2: Docker Desktop ────────────────────────────────────────────────────
Write-Section "2 of 6  --  Docker Desktop"

$dockerInPath = $null -ne (Get-Command docker -ErrorAction SilentlyContinue)
$dockerInstalled = Test-Path $DockerExe

if (-not $dockerInPath -and -not $dockerInstalled) {
    Write-Warn "Docker Desktop is not installed."
    Write-Host ""
    Write-Host "Path runs inside Docker containers -- Docker Desktop is required."
    Write-Host "The installer is about 500 MB."
    Write-Host ""
    $install = Read-Host "Download and run the Docker Desktop installer now? [Y/n]"
    if ($install -eq "n" -or $install -eq "N") {
        Exit-Error "Docker Desktop is required. Download from https://www.docker.com/products/docker-desktop/ then re-run."
    }

    $installerPath = Join-Path $env:TEMP "DockerDesktopInstaller.exe"
    Write-Info "Downloading Docker Desktop (~500 MB)..."
    try {
        Invoke-WebRequest -Uri $DockerDlUrl -OutFile $installerPath -UseBasicParsing
    } catch {
        Exit-Error "Download failed. Download Docker Desktop manually from https://www.docker.com/products/docker-desktop/ and re-run this script."
    }

    Write-Info "Running installer. Follow the prompts on screen."
    Write-Warn "If prompted to enable WSL 2, accept it -- Docker Desktop requires it."
    Start-Process -FilePath $installerPath -Wait
    Remove-Item $installerPath -ErrorAction SilentlyContinue

    Write-Warn "Docker Desktop has been installed."
    Write-Warn "If Windows asks you to restart, do so, then run this script again."
    Read-Host "Press Enter to continue (or close this window and restart if prompted)"
}

# Start Docker Desktop if it is not already running
if (-not (Test-DockerRunning)) {
    if (Test-Path $DockerExe) {
        Write-Info "Starting Docker Desktop..."
        Start-Process $DockerExe
    } elseif ($null -ne (Get-Command docker -ErrorAction SilentlyContinue)) {
        # Docker is in PATH but daemon not responding -- try waiting
        Write-Info "Waiting for Docker daemon..."
    } else {
        Exit-Error "Docker Desktop not found. Install it from https://www.docker.com/products/docker-desktop/ and re-run."
    }

    $timeout = 120
    $elapsed = 0
    Write-Host "Waiting for Docker to start (this can take up to a minute)" -NoNewline
    while (-not (Test-DockerRunning) -and $elapsed -lt $timeout) {
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 3
        $elapsed += 3
    }
    Write-Host ""

    if (-not (Test-DockerRunning)) {
        Exit-Error "Docker Desktop did not start in time. Open it from the Start menu, wait for it to show 'Docker Desktop is running' in the system tray, then re-run this script."
    }
}

# Verify docker compose plugin
try {
    $null = & docker compose version 2>&1
    if ($LASTEXITCODE -ne 0) { throw }
} catch {
    Exit-Error "'docker compose' plugin not found. Update Docker Desktop to the latest version and re-run."
}

Write-Ok "Docker Desktop is ready"

# ── Step 3: Installation tier ─────────────────────────────────────────────────
Write-Section "3 of 6  --  Choose your installation"
Write-Host ""
Write-Host "  1) Basic     Portfolio editor, version history, Word export"
Write-Host "               ~1.9 GB installed  (~850 MB to download)"
Write-Host ""
Write-Host "  2) Standard  Adds full-text search across your portfolio"
Write-Host "               ~2.3 GB installed  (~1.0 GB to download)"
Write-Host ""
Write-Host "  3) Full      Adds writing tools, grammar checker, link checker,"
Write-Host "               cloud backup, and AI client support"
Write-Host "               ~4.0 GB installed  (~1.8 GB to download)"
Write-Host ""

$Tier = ""
$Profiles = ""
while ($true) {
    $choice = Read-Host "Choose [1/2/3] (default: 2)"
    if ($choice -eq "") { $choice = "2" }
    switch ($choice) {
        "1" { $Tier = "Basic";    $Profiles = "export";                           break }
        "2" { $Tier = "Standard"; $Profiles = "export,search";                    break }
        "3" { $Tier = "Full";     $Profiles = "export,search,ai,writing,backup";  break }
        default { Write-Warn "Please enter 1, 2, or 3." }
    }
    if ($Tier -ne "") { break }
}
Write-Ok "Installing: $Tier"

# ── Step 4: Download Path ─────────────────────────────────────────────────────
Write-Section "4 of 6  --  Download Path"
Write-Host "Where would you like to install Path?"
$inputDir = Read-Host "Install directory [$DefaultDir]"
if ($inputDir -eq "") { $inputDir = $DefaultDir }
$InstallDir = $inputDir

if (Test-Path (Join-Path $InstallDir ".git")) {
    Write-Info "Path is already installed at $InstallDir"
    $update = Read-Host "Update to the latest version? [Y/n]"
    if ($update -ne "n" -and $update -ne "N") {
        & git -C $InstallDir pull --ff-only
        Write-Ok "Updated."
    } else {
        Write-Ok "Keeping existing version."
    }
} elseif ((Test-Path $InstallDir) -and (Get-ChildItem $InstallDir -ErrorAction SilentlyContinue)) {
    Exit-Error "Directory '$InstallDir' exists and is not empty. Choose a different location."
} else {
    Write-Info "Cloning Path into $InstallDir ..."
    & git clone $RepoUrl $InstallDir
    Write-Ok "Downloaded."
}

Set-Location $InstallDir

# ── Step 5: Credentials ───────────────────────────────────────────────────────
Write-Section "5 of 6  --  Login credentials"

$envFile = Join-Path $InstallDir ".env"
$needsCreds = $true
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "^SB_USER=.+" -and $envContent -notmatch "admin:changeme") {
        Write-Ok "Credentials already set (found .env -- skipping)."
        $needsCreds = $false
    }
}

if ($needsCreds) {
    Write-Host "Set a username and password for Path."
    Write-Host "You will use these to log in when you open the app in your browser."
    Write-Host ""
    $username = Read-Host "Username [admin]"
    if ($username -eq "") { $username = "admin" }

    while ($true) {
        $securePass  = Read-Host "Password" -AsSecureString
        $securePass2 = Read-Host "Confirm password" -AsSecureString
        $pass  = ConvertFrom-SecureStringPlain $securePass
        $pass2 = ConvertFrom-SecureStringPlain $securePass2
        if ($pass -eq $pass2) { break }
        Write-Warn "Passwords don't match -- try again."
    }
    if ($pass.Length -lt 8) {
        Write-Warn "Password is very short. Consider using something longer."
    }
    # Write .env WITHOUT a BOM. Windows PowerShell 5.1's "Set-Content -Encoding
    # UTF8" prepends a UTF-8 BOM, which Docker Compose can misread so that the
    # first variable (SB_USER) is treated as unset — breaking login. WriteAllText
    # with UTF8Encoding($false) produces a clean, BOM-free file.
    [System.IO.File]::WriteAllText($envFile, "SB_USER=${username}:${pass}`n", [System.Text.UTF8Encoding]::new($false))
    Write-Ok "Credentials saved to .env"
}

# ── Step 6: Pull images and start ─────────────────────────────────────────────
Write-Section "6 of 6  --  Download images and start Path"
Write-Host "Downloading images ($Tier install). This takes a few minutes on first run."
Write-Host ""

$profileArgs = $Profiles -split "," | ForEach-Object { "--profile", $_ }

& docker compose @profileArgs pull
if ($LASTEXITCODE -ne 0) { Exit-Error "Image download failed. Check the error above." }

Write-Host ""
Write-Info "Starting Path..."
& docker compose @profileArgs up -d
if ($LASTEXITCODE -ne 0) { Exit-Error "Failed to start Path. Run 'docker compose logs' in $InstallDir to investigate." }

# Wait for SilverBullet to respond
$timeout = 90
$elapsed = 0
Write-Host "Waiting for Path to start" -NoNewline
$started = $false
while ($elapsed -lt $timeout) {
    try {
        $null = Invoke-WebRequest -Uri $AppUrl -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        $started = $true
        break
    } catch {
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
        $elapsed += 2
    }
}
Write-Host ""

if (-not $started) {
    Write-Warn "Path is taking longer than expected to start."
    Write-Warn "Check logs with: docker compose logs -f"
    Write-Warn "Then open $AppUrl manually when ready."
} else {
    Write-Ok "Path is running"
    Start-Process $AppUrl
}

# ── Done ──────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host ("-" * 50)
Write-Host "Path is ready." -ForegroundColor Green
Write-Host ""
Write-Host "  Open:   $AppUrl"
Write-Host "  Stop:   cd $InstallDir  then  docker compose down"
Write-Host "  Start:  cd $InstallDir  then  docker compose $($profileArgs -join ' ') up -d"
Write-Host "  Logs:   cd $InstallDir  then  docker compose logs -f"
Write-Host ""

if ($Tier -eq "Full") {
    Write-Host ("-" * 50)
    Write-Host "Cloud backup needs one-time configuration:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  cd $InstallDir"
    Write-Host "  docker compose run --rm rclone-svc rclone config"
    Write-Host ""
    Write-Host "This walks you through connecting to Google Drive, Dropbox,"
    Write-Host "OneDrive, or any other cloud storage provider."
    Write-Host ""
}

Write-Host "Bookmark $AppUrl in your browser -- that is how you open Path each day."
Write-Host ""
Read-Host "Press Enter to close this window"
