# RPP Auto Mobile App

**Owner:** Lewis Gray
**Status:** Active Development

## Project Overview
RPP Auto is a comprehensive mobile application designed for vehicle diagnostics, maintenance scheduling, and mechanic connection.

## Build Status
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://expo.dev)

## Configuration
*   **App Config:** `app.json` (Managed by Expo Prebuild)
*   **Build Config:** `eas.json` (Managed by EAS CLI)
*   **Assets:** Located in `/assets` folder.

## How to Build
1.  **Development (APK):**
    ```bash
    eas build --platform android --profile development
    ```
2.  **Production (AAB):**
    ```bash
    eas build --platform android --profile production
    ```
```

---

### 5. TERMINAL COMMANDS (The "Sync" Step)
**This is the most important step.** This will take the files you just edited, plus your splash screen image, and push them to GitHub so Expo.dev can see them.

**Instructions:**
1.  Open your **VS Code Terminal**.
2.  Paste these commands **one block at a time**.

**Block A: Create Assets from your Custom Splash Image**
*(This assumes your custom image "01 - Splash Screen.png" is inside the assets folder. If it's not, move it there first).*

```bash
# Navigate to assets
cd assets

# Create the 4 required icons by copying your custom splash image
# (We rename it to exactly what app.json expects)
cp "01 - Splash Screen.png" adaptive-icon.png
cp "01 - Splash Screen.png" icon.png
cp "01 - Splash Screen.png" splash.png
cp "01 - Splash Screen.png" favicon.png

# Go back to main folder
cd ..
```

**Block B: Sync with GitHub (Lewis Gray's Repo)**
*(This forces the new config and assets up to the cloud)*

```bash
# Force add the assets (in case gitignore was blocking them)
git add -f assets/icon.png assets/splash.png assets/adaptive-icon.png assets/favicon.png

# Add the configuration file updates
git add app.json eas.json package.json README.md

# Commit the changes
git commit -m "fix: Complete Project Sync for Lewis Gray - Config & Assets"

# Push to GitHub
git push origin main
```

**Block C: Run the Build**
*(Run this ONLY after the push above completes successfully)*

```bash
eas build --platform android --profile development

