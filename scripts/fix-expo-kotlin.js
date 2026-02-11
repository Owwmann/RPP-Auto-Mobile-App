#!/bin/bash

# ============================================================
# 🔒 RPP AUTO - MASTER SYNCHRONIZATION PROTOCOL
# TARGET: ENFORCE LEWIS GRAY OWNERSHIP
# ZONES: LOCAL | GITHUB | EXPO.DEV
# ============================================================

echo "🔄 INITIATING DEEP SYSTEM SYNCHRONIZATION..."
echo "================================================"

# 1. HARD RESET CONFIGURATION (app.json)
# This forces the Owner and Slug to match Lewis Gray exclusively
echo "🛠️  Patching app.json..."
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
# Enforces correct build types and Android app-bundle standards
echo "☁️  Configuring EAS Build Pipeline..."
if [ -f "eas.json" ]; then
    # Ensure production uses app-bundle, not apk or aab (syntax check)
    sed -i 's/"buildType": "aab"/"buildType": "app-bundle"/g' eas.json
fi

# 4. REMOVE GHOST ARTIFACTS
# Deletes cached configs that might hold old IDs
echo "🧹 Cleaning Ghost Artifacts..."
rm -rf .expo
rm -rf android
rm -rf ios
rm -f yarn.lock  # Enforce NPM usage

# 5. GITHUB SYNC
echo "🔗 Synchronizing with GitHub..."
git add .
git commit -m "feat: Enforce Master Identity Sync for Lewis Gray"
# Note: This pushes to the current remote. 
# If your remote is still Owwmann, we will fix that in Phase 2.
git push origin main

echo ""
echo "✅ MASTER SYNCHRONIZATION COMPLETE."
echo "================================================"
```

---

#### **Phase 2: Platform alignment (Do this IMMEDIATELY after the script)**

The script fixed your files. Now we must fix the **Connections**.

**1. Fix GitHub Connection:**
Your screenshots show the repo is `Owwmann/RPP-Auto-Mobile-App`. You need to ensure your local terminal points to **Lewis Gray's** repo (if you forked it) or that you have full admin rights on Owwmann's repo.

Run this to check:
```bash
git remote -v
```
*   **If it says `Owwmann`:** That is okay ONLY if you are an admin on that repo.
*   **If it should be `LewisGray`:** Run:
    ```bash
    git remote set-url origin https://github.com/LewisGray/RPP-Auto-Mobile-App.git
    ```

**2. Fix Expo.dev Connection (The "Install" Fix):**
This is the step that fixes the build failure.

Run this command in your terminal:
```bash
eas build:configure
```
*   It will ask: **"Configure this project for EAS Build?"** -> Type **Y**.
*   It might say: **"Project 'rpp-auto-mobile-app' belongs to 'owwmann'. Link this project?"** -> **SAY NO.**
*   **Create a NEW project** under the account **lewisgray**.

**3. Run the Build:**
Now that the `app.json` has the correct owner (`lewisgray`) and the project is linked to the correct account, run the build command:

```bash
eas build --platform android --profile development
  
