#!/bin/bash
# ═══════════════════════════════════════════════
# NEXUS PUPPY FLOW — Deploy Script
# 
# Uso: bash deploy.sh
# 
# Hace commit + push a GitHub y deploy a Netlify.
# El site ID está en netlify.toml, así que funciona
# incluso si clonas el repo en otra máquina.
# ═══════════════════════════════════════════════

set -e

echo "🐾 Nexus Puppy Flow — Deploy"
echo "═══════════════════════════════"

# Verificar que hay cambios para commitear
if git diff --quiet && git diff --cached --quiet; then
  echo "ℹ️  No hay cambios nuevos. Solo se hará deploy."
  echo ""
  echo "🚀 Desplegando a Netlify..."
  netlify deploy --prod --dir=.
  echo "✅ Deploy completado: https://fanciful-panda-d32cde.netlify.app"
  exit 0
fi

# 1. Push to GitHub
echo ""
echo "📤 Pusheando a GitHub..."
git add -A
git commit -m "update: $(date '+%Y-%m-%d %H:%M')"
git push
echo "✅ Push a GitHub completado"

# 2. Deploy to Netlify
echo ""
echo "🚀 Desplegando a Netlify..."
netlify deploy --prod --dir=. --message "Deploy $(date '+%Y-%m-%d %H:%M')"
echo "✅ Deploy completado: https://fanciful-panda-d32cde.netlify.app"

echo ""
echo "🎉 ¡Todo listo!"
