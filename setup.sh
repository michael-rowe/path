#!/usr/bin/env bash
# Path — Linux setup script
# Downloads and starts the Path portfolio app.
# Usage: bash setup.sh
set -euo pipefail

# ── Colour helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'
ok()      { echo -e "${GREEN}✓${RESET}  $*"; }
info()    { echo -e "${CYAN}→${RESET}  $*"; }
warn()    { echo -e "${YELLOW}!${RESET}  $*"; }
die()     { echo -e "${RED}✗  $*${RESET}" >&2; exit 1; }
section() { echo ""; echo -e "${BOLD}$*${RESET}"; echo "────────────────────────────────────────────────"; }

# Generate a random hex key (used for the Meilisearch master key). Prefers
# openssl; falls back to /dev/urandom so the script works on minimal systems.
gen_key() {
    if command -v openssl &>/dev/null; then
        openssl rand -hex 24
    else
        head -c 24 /dev/urandom | od -An -tx1 | tr -d ' \n'
    fi
}

REPO_URL="https://github.com/michael-rowe/path.git"
DEFAULT_DIR="$HOME/path"
PORT=3000
URL="http://localhost:${PORT}"

# ── Welcome ───────────────────────────────────────────────────────────────────
clear
echo ""
echo -e "${BOLD}Path — portfolio setup${RESET}"
echo "────────────────────────────────────────────────"
echo ""
echo "This script will:"
echo "  1. Check that Docker is installed and running"
echo "  2. Download Path from GitHub"
echo "  3. Ask for your login credentials"
echo "  4. Start the app and open it in your browser"
echo ""
read -rp "Press Enter to continue, or Ctrl+C to cancel... "

# ── Step 1: git ───────────────────────────────────────────────────────────────
section "1 of 6  —  Git"
if command -v git &>/dev/null; then
    ok "Git is installed"
else
    warn "Git is not installed."
    read -rp "Install git now? [Y/n] " _ans
    _ans="${_ans:-Y}"
    if [[ "$_ans" =~ ^[Yy]$ ]]; then
        if command -v apt-get &>/dev/null; then
            sudo apt-get update -qq && sudo apt-get install -y git
        elif command -v dnf &>/dev/null; then
            sudo dnf install -y git
        elif command -v pacman &>/dev/null; then
            sudo pacman -Sy --noconfirm git
        else
            die "Cannot detect package manager. Install git manually then re-run this script."
        fi
        ok "Git installed."
    else
        die "Git is required. Install it and re-run this script."
    fi
fi

# ── Step 2: Docker ────────────────────────────────────────────────────────────
section "2 of 6  —  Docker"
if ! command -v docker &>/dev/null; then
    warn "Docker is not installed."
    echo ""
    echo "Path runs inside Docker containers — Docker Engine is required."
    echo "The official Docker install script will be downloaded and run with sudo."
    echo "You can review it first at: https://get.docker.com"
    echo ""
    read -rp "Download and install Docker now? [Y/n] " _ans
    _ans="${_ans:-Y}"
    if [[ "$_ans" =~ ^[Yy]$ ]]; then
        info "Downloading Docker install script..."
        curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
        info "Running installer (you may be prompted for your password)..."
        sudo sh /tmp/get-docker.sh
        rm -f /tmp/get-docker.sh
        sudo usermod -aG docker "$USER"
        ok "Docker installed."
        warn "You were added to the 'docker' group."
        warn "A log-out/in is needed for this to take permanent effect, but"
        warn "this script will continue using 'sudo docker' for the remainder of setup."
    else
        die "Docker is required. See https://docs.docker.com/engine/install/ then re-run."
    fi
fi

# Work out whether docker needs sudo
if docker info &>/dev/null 2>&1; then
    DC="docker compose"
elif sudo docker info &>/dev/null 2>&1; then
    DC="sudo docker compose"
    warn "Running docker with sudo (not yet in the docker group)."
else
    die "Docker daemon is not responding. Try: sudo systemctl start docker"
fi

if ! $DC version &>/dev/null; then
    die "'docker compose' plugin not found. Install Docker Engine v20.10 or later."
fi
ok "Docker is ready"

# ── Step 3: Installation tier ─────────────────────────────────────────────────
section "3 of 6  —  Choose your installation"
echo ""
echo "  1) Basic     Portfolio editor, version history, Word export"
echo "               ~1.9 GB installed  (~850 MB to download)"
echo ""
echo "  2) Standard  Adds full-text search across your portfolio"
echo "               ~2.3 GB installed  (~1.0 GB to download)"
echo ""
echo "  3) Full      Adds writing tools, grammar checker, link checker,"
echo "               cloud backup, and AI client support"
echo "               ~4.0 GB installed  (~1.8 GB to download)"
echo ""
while true; do
    read -rp "Choose [1/2/3] (default: 2): " _choice
    _choice="${_choice:-2}"
    case "$_choice" in
        1) TIER="Basic";    PROFILES="export";                            break ;;
        2) TIER="Standard"; PROFILES="export,search";                     break ;;
        3) TIER="Full";     PROFILES="export,search,ai,writing,backup";   break ;;
        *) warn "Please enter 1, 2, or 3." ;;
    esac
done
ok "Installing: ${TIER}"

# ── Step 4: Download Path ─────────────────────────────────────────────────────
section "4 of 6  —  Download Path"
echo "Where would you like to install Path?"
read -rp "Install directory [${DEFAULT_DIR}]: " INSTALL_DIR
INSTALL_DIR="${INSTALL_DIR:-$DEFAULT_DIR}"
INSTALL_DIR="${INSTALL_DIR/#\~/$HOME}"

if [[ -d "$INSTALL_DIR/.git" ]]; then
    info "Path is already installed at $INSTALL_DIR"
    read -rp "Update to the latest version? [Y/n] " _ans
    _ans="${_ans:-Y}"
    if [[ "$_ans" =~ ^[Yy]$ ]]; then
        git -C "$INSTALL_DIR" pull --ff-only
        ok "Updated."
    else
        ok "Keeping existing version."
    fi
elif [[ -d "$INSTALL_DIR" && "$(ls -A "$INSTALL_DIR" 2>/dev/null)" ]]; then
    die "Directory '$INSTALL_DIR' exists and is not empty. Choose a different location."
else
    info "Cloning Path into $INSTALL_DIR ..."
    git clone "$REPO_URL" "$INSTALL_DIR"
    ok "Downloaded."
fi

cd "$INSTALL_DIR"

# ── Step 5: Credentials ───────────────────────────────────────────────────────
section "5 of 6  —  Login credentials"
if [[ -f .env ]] && grep -q "^SB_USER=" .env && ! grep -q "admin:changeme" .env; then
    ok "Credentials already set (found .env — skipping)."
else
    echo "Set a username and password for Path."
    echo "You will use these to log in when you open the app in your browser."
    echo ""
    read -rp "Username [admin]: " _user
    _user="${_user:-admin}"
    while true; do
        read -rsp "Password: " _pass; echo ""
        read -rsp "Confirm password: " _pass2; echo ""
        [[ "$_pass" == "$_pass2" ]] && break
        warn "Passwords don't match — try again."
    done
    if [[ ${#_pass} -lt 8 ]]; then
        warn "Password is very short. Consider using something longer."
    fi
    printf "SB_USER=%s:%s\n" "$_user" "$_pass" > .env
    ok "Credentials saved to .env"
fi

# Meilisearch master key — generate a unique random key per install instead of
# shipping the shared default ("masterKey"). Written to .env and mirrored into
# the plug's runtime config so the in-app search bar uses the same key.
if grep -q "^MEILI_MASTER_KEY=" .env 2>/dev/null; then
    MEILI_KEY="$(grep '^MEILI_MASTER_KEY=' .env | head -1 | cut -d= -f2-)"
    ok "Meilisearch key already set."
else
    MEILI_KEY="$(gen_key)"
    printf "MEILI_MASTER_KEY=%s\n" "$MEILI_KEY" >> .env
    ok "Generated a unique Meilisearch key."
fi

# Mirror the key into the plug's config page (gitignored, per-install) so the
# browser search bar authenticates. Update in place if the page already exists
# (preserves any custom sidecar URLs); otherwise create it.
mkdir -p space/_system
if [[ -f space/_system/path-config.md ]] && grep -q '^meili_key:' space/_system/path-config.md; then
    sed -i "s|^meili_key:.*|meili_key: ${MEILI_KEY}|" space/_system/path-config.md
    ok "Updated meili_key in existing runtime config."
else
    cat > space/_system/path-config.md <<EOF
---
readonly: true
meili_url: http://localhost:7700
meili_key: ${MEILI_KEY}
git_watcher_url: http://localhost:8020
lychee_url: http://localhost:8030
rclone_url: http://localhost:8040
languagetool_url: http://localhost:8010
---

# Path configuration

Runtime settings the Path plug reads at panel-render time. \`meili_key\` must
match \`MEILI_MASTER_KEY\` in \`.env\` — regenerate both together if rotating.
EOF
    ok "Wrote runtime config (space/_system/path-config.md)."
fi

# ── Step 6: Pull images and start ─────────────────────────────────────────────
section "6 of 6  —  Download images and start Path"
echo "Downloading images (${TIER} install). This takes a few minutes on first run."
echo ""
COMPOSE_PROFILES="$PROFILES" $DC pull
echo ""
info "Starting Path..."
COMPOSE_PROFILES="$PROFILES" $DC up -d

# Wait for SilverBullet to respond
info "Waiting for Path to start..."
TIMEOUT=90
ELAPSED=0
until curl -sf "$URL" -o /dev/null 2>/dev/null; do
    if [[ $ELAPSED -ge $TIMEOUT ]]; then
        echo ""
        warn "Path is taking longer than expected."
        warn "Check what's happening with: $DC logs -f"
        warn "Then open ${URL} manually when ready."
        exit 0
    fi
    printf "."
    sleep 2
    ELAPSED=$((ELAPSED + 2))
done
echo ""
ok "Path is running"

# Open browser
if command -v xdg-open &>/dev/null; then
    xdg-open "$URL" &>/dev/null &
elif command -v sensible-browser &>/dev/null; then
    sensible-browser "$URL" &>/dev/null &
else
    warn "Could not detect a browser. Open ${URL} manually."
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────────────────"
echo -e "${BOLD}${GREEN}Path is ready.${RESET}"
echo ""
echo -e "  Open:   ${CYAN}${URL}${RESET}"
echo "  Stop:   cd ${INSTALL_DIR} && docker compose down"
echo "  Start:  cd ${INSTALL_DIR} && COMPOSE_PROFILES=${PROFILES} docker compose up -d"
echo "  Logs:   cd ${INSTALL_DIR} && docker compose logs -f"
echo ""

# Rclone note for Full installs
if [[ "$TIER" == "Full" ]]; then
    echo "────────────────────────────────────────────────"
    echo -e "${YELLOW}Cloud backup needs one-time configuration:${RESET}"
    echo ""
    echo "  cd ${INSTALL_DIR}"
    echo "  docker compose run --rm rclone-svc rclone config"
    echo ""
    echo "This walks you through connecting to Google Drive, Dropbox,"
    echo "OneDrive, or any other cloud storage provider."
    echo ""
fi

echo "Bookmark ${URL} in your browser — that is how you open Path each day."
echo ""
