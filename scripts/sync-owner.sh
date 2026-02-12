#!/bin/bash
# ============================================================
# RPP AUTO - MASTER SYNCHRONIZATION SCRIPT
# TARGET: ENFORCE LEWIS GRAY OWNERSHIP
# ZONES: LOCAL | GITHUB | EXPO.DEV
# ============================================================
echo "🔄 INITIATING DEEP SYSTEM SYNCHRONIZATION..."
echo "================================================"

# 1. HARD RESET CONFIGURATION (app.json)
# This forces the Owner and Slug to match Lewis Gray exclusively
echo "🛠️ Patching app.json..."
sed -i 's/"owner": ".*"/"owner": "lewisgray"/g' app.json
sed -i 's/"slug": ".*"/"slug": "rpp-auto-mobile-app"/g' app.json
sed -i 's/"package": ".*"/"package": "com.lewisgray.rppautomobileapp"/g' app.json
sed -i 's/"bundleIdentifier": ".*"/"bundleIdentifier": "com.lewisgray.rppautomobileapp"/g' app.json

# 2. SANITIZE DEPENDENCIES (package.json)
# Removes references to the old template owner in the package definition
echo "📦 Sanitizing package.json..."
sed -i 's/"author": ".*"/"author": "Lewis Gray"/g' package.json
sed -i 's|github.com/.*/RPP-Auto-Mobile-App|github.com/LewisGray/RPP-Auto-Mobile-App|g' package.json

# 3. CONFIGURE BUILD PIPELINE (eas.json)
# Enforces correct build types and updates any owner references
echo "☁️ Configuring EAS Build Pipeline..."
if [ -f "eas.json" ]; then
  sed -i 's/"buildType": "aab"/"buildType": "app-bundle"/g' eas.json
  sed -i 's/owwmann/lewisgray/g' eas.json
fi

# 4. REMOVE GHOST ARTIFACTS
# Deletes cached configs that might hold old IDs
echo "🧹 Cleaning Ghost Artifacts..."
rm -rf .expo
rm -rf android
rm -rf ios
rm -f yarn.lock # Enforce NPM usage

echo ""
echo "✅ SYNCHRONIZATION COMPLETE"
echo "================================================"
echo "Please run: 'git add . && git commit -m \"fix: sync owner settings\" && git push origin main'"
