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
    

