#!/usr/bin/env bash
# One-time bootstrap for the Loadly Oracle Always Free VM (Ubuntu 24.04, arm64).
# Run once over SSH as a sudo-capable user: bash setup.sh
set -euo pipefail

REPO_URL="https://github.com/cynorra/yukle-next.git"
APP_DIR="/opt/loadly/app"

echo "==> Installing Node.js 20 LTS"
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "==> Installing Caddy"
if ! command -v caddy >/dev/null 2>&1; then
  sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl gnupg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
  sudo apt-get update
  sudo apt-get install -y caddy
fi

echo "==> Installing PM2"
sudo npm install -g pm2

echo "==> Configuring firewall (ufw): allow SSH, HTTP, HTTPS only"
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo "==> Cloning repo into $APP_DIR"
sudo mkdir -p "$(dirname "$APP_DIR")"
sudo chown "$USER":"$USER" "$(dirname "$APP_DIR")"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "==> Registering PM2 to survive reboots"
pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 | sudo bash || true

cat <<'EOF'

==> Bootstrap done. Next steps (manual):
1. Create /opt/loadly/app/.env.production.local with the server-required
   env vars listed in deploy/README.md (paste values yourself over SSH —
   never share secrets in chat).
2. Run: bash /opt/loadly/app/deploy/deploy.sh
3. Follow deploy/README.md for the test-subdomain verification and DNS
   cutover steps. Do NOT install deploy/Caddyfile until the cutover step.
EOF
