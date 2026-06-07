#!/bin/bash
# ═══════════════════════════════════════════════
# NEXUS PUPPY FLOW — Deploy Script
# Uso: bash deploy.sh
# ═══════════════════════════════════════════════

set -e

echo "🐾 Nexus Puppy Flow — Deploy"
echo "═══════════════════════════════"

# 1. Push to GitHub
echo ""
echo "📤 Pusheando a GitHub..."
git add .
git commit --allow-empty -m "update: $(date '+%Y-%m-%d %H:%M')"
git push
echo "✅ Push a GitHub completado"

# 2. Deploy to Netlify
echo ""
echo "🚀 Desplegando a Netlify..."
netlify deploy --prod --dir=. --message "Deploy $(date '+%Y-%m-%d %H:%M')"
echo "✅ Deploy a Netlify completado"

echo ""
echo "🎉 ¡Todo listo!"
