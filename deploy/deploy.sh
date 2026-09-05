#!/usr/bin/env bash
# Repeatable deploy: pull latest code, rebuild, restart the app under PM2.
# Run on the VM: bash /opt/loadly/app/deploy/deploy.sh
set -euo pipefail

APP_DIR="/opt/loadly/app"
cd "$APP_DIR"

if [ ! -f .env.production.local ]; then
  echo "Missing $APP_DIR/.env.production.local — see deploy/README.md. Aborting." >&2
  exit 1
fi

echo "==> git pull"
git pull --ff-only

echo "==> npm ci"
npm ci

echo "==> next build"
npm run build

echo "==> assembling standalone output (output: 'standalone' doesn't include public/ or static assets or .env files)"
rm -rf .next/standalone/public .next/standalone/.next/static
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp .env.production.local .next/standalone/.env.production.local

echo "==> (re)starting via pm2"
pm2 startOrReload deploy/ecosystem.config.js
pm2 save

echo "==> done"
