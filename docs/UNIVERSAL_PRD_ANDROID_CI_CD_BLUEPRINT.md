# 🚀 UNIVERSAL PRD: AUTOMATED GITHUB ACTIONS CI/CD PIPELINE APK ANDROID MOBILE APP BLUEPRINT

**Document Version:** 3.0  
**Created:** January 27, 2026  
**Application:** Universal Template (Reference: RPP Auto)  
**Purpose:** Master blueprint for all future Android mobile app automated builds on GitHub  
**Status:** ✅ APPROVED FOR UNIVERSAL USE

---

## 📋 EXECUTIVE SUMMARY

This document serves as the **MASTER BLUEPRINT** for configuring API keys, secrets, environment variables, and GitHub Actions CI/CD pipeline for automated Android app builds. Use this as a **universal template** for all future mobile applications.

### Scope

- ✅ Complete list of ALL API keys and secrets required
- ✅ GitHub Actions CI/CD configuration and workflow YAML
- ✅ Environment variable organization and structure
- ✅ Security best practices and encryption guidelines
- ✅ Automated build, sign, and release pipeline setup
- ✅ Google Play Store deployment automation
- ✅ Multi-environment configuration (dev/staging/production)

---

## 🔑 SECTION 1: COMPLETE API KEY INVENTORY (24 SECRETS)

### **Group 1: Android App Signing (4 Secrets)**

*Critical for signing the APK/AAB files for distribution*

#### 1. `KEYSTORE_PASSWORD`
- **Purpose:** Password for the Android keystore file
- **Format:** Strong alphanumeric password with special characters
- **Location:** GitHub Secrets ONLY
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** Generated during keystore creation
- **Required For:** Signing the release APK/AAB
- **GitHub Secret Name:** `KEYSTORE_PASSWORD`

#### 2. `KEY_PASSWORD`
- **Purpose:** Password for the signing key alias
- **Format:** Strong alphanumeric password with special characters
- **Location:** GitHub Secrets ONLY
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** Generated during keystore creation
- **Required For:** Unlocking the signing key
- **GitHub Secret Name:** `KEY_PASSWORD`

#### 3. `KEY_ALIAS`
- **Purpose:** Alias name for the signing key
- **Format:** Alphanumeric string (e.g., "key0", "release-key")
- **Location:** GitHub Secrets
- **Exposure Level:** 🔒 Private
- **Get From:** Defined during keystore creation
- **Required For:** Identifying which key to use for signing
- **GitHub Secret Name:** `KEY_ALIAS`

#### 4. `KEYSTORE_FILE_BASE64`
- **Purpose:** Base64-encoded Android keystore file (.jks or .keystore)
- **Format:** Base64 string (very long)
- **Location:** GitHub Secrets ONLY
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** Encode keystore file: `base64 -i your-keystore.jks | pbcopy`
- **Required For:** Decoding and using keystore in CI/CD
- **GitHub Secret Name:** `KEYSTORE_FILE_BASE64`

---

### **Group 2: Google Play Store Upload (1 Secret)**

*Required for automated release to Google Play Store*

#### 5. `GOOGLE_SERVICE_ACCOUNT_JSON`
- **Purpose:** Service account credentials for Google Play Console API
- **Format:** JSON file (entire content as single-line string)
- **Location:** GitHub Secrets ONLY
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** 
  1. Go to Google Cloud Console
  2. Create a service account with Play Console API access
  3. Download JSON key file
- **Required For:** Automated APK/AAB upload to Play Store
- **GitHub Secret Name:** `GOOGLE_SERVICE_ACCOUNT_JSON`
- **Note:** Service account must be granted "Release Manager" role in Play Console

---

### **Group 3: Infrastructure & Hosting (5 Secrets)**

*Used for backend deployment and server access*

#### 6. `VERCEL_TOKEN`
- **Purpose:** Deploy backend/API to Vercel
- **Format:** Token string (starts with various prefixes)
- **Location:** GitHub Secrets, Backend environment
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** https://vercel.com/account/tokens
- **Required For:** Automated Vercel deployments
- **GitHub Secret Name:** `VERCEL_TOKEN`

#### 7. `VERCEL_PROJECT_ID`
- **Purpose:** Identify which Vercel project to deploy
- **Format:** Project ID string (e.g., "prj_...")
- **Location:** GitHub Secrets, Backend environment
- **Exposure Level:** 🔒 Private
- **Get From:** Vercel project settings
- **Required For:** Target Vercel project for deployment
- **GitHub Secret Name:** `VERCEL_PROJECT_ID`

#### 8. `SSH_HOST`
- **Purpose:** SSH server hostname for deployment
- **Format:** Hostname or IP address
- **Location:** GitHub Secrets
- **Exposure Level:** 🔒 Private
- **Get From:** Hosting provider
- **Required For:** SSH-based deployments
- **GitHub Secret Name:** `SSH_HOST`

#### 9. `SSH_USERNAME`
- **Purpose:** SSH username for server access
- **Format:** Username string
- **Location:** GitHub Secrets
- **Exposure Level:** 🔒 Private
- **Get From:** Hosting provider
- **Required For:** SSH authentication
- **GitHub Secret Name:** `SSH_USERNAME`

#### 10. `IONOS_PASSWORD`
- **Purpose:** Password for IONOS hosting
- **Format:** Password string
- **Location:** GitHub Secrets ONLY
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** IONOS account settings
- **Required For:** IONOS deployment automation
- **GitHub Secret Name:** `IONOS_PASSWORD`

---

### **Group 4: Application API Keys (14 Secrets)**

*Used by the app logic for Payments, Database, AI, Maps, etc.*

#### 11. `EXPO_TOKEN`
- **Purpose:** Expo build service authentication
- **Format:** Token string
- **Location:** GitHub Secrets, Mobile app environment
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** https://expo.dev/accounts/[account]/settings/access-tokens
- **Required For:** Expo builds and updates
- **GitHub Secret Name:** `EXPO_TOKEN`

#### 12. `STRIPE_PUBLISHABLE_KEY`
- **Purpose:** Client-side payment form rendering
- **Format:** `pk_test_...` (test) or `pk_live_...` (production)
- **Location:** Mobile app environment variables
- **Exposure Level:** ✅ SAFE to expose (designed for client-side)
- **Get From:** https://dashboard.stripe.com/apikeys
- **Required For:** Mobile app payment screens
- **GitHub Secret Name:** `STRIPE_PUBLISHABLE_KEY`
- **Environment Variable:** `STRIPE_PUBLISHABLE_KEY` (injected into app)

#### 13. `STRIPE_SECRET_KEY`
- **Purpose:** Server-side payment processing
- **Format:** `sk_test_...` (test) or `sk_live_...` (production)
- **Location:** Backend server ONLY
- **Exposure Level:** ⛔ NEVER expose in mobile app
- **Get From:** https://dashboard.stripe.com/apikeys
- **Required For:** Backend payment intent creation
- **GitHub Secret Name:** `STRIPE_SECRET_KEY`
- **Note:** ONLY used in backend API, never in mobile app

#### 14. `SUPABASE_URL`
- **Purpose:** Supabase project API endpoint
- **Format:** `https://[project-id].supabase.co`
- **Location:** Mobile app environment, Backend environment
- **Exposure Level:** ✅ SAFE to expose (public project URL)
- **Get From:** https://app.supabase.com/project/[project]/settings/api
- **Required For:** Database and authentication connections
- **GitHub Secret Name:** `SUPABASE_URL`
- **Environment Variable:** `SUPABASE_URL`

#### 15. `SUPABASE_ANON_KEY`
- **Purpose:** Public anonymous key for client-side Supabase access
- **Format:** JWT token (long eyJ... string)
- **Location:** Mobile app environment
- **Exposure Level:** ✅ SAFE to expose (public anon key with RLS)
- **Get From:** https://app.supabase.com/project/[project]/settings/api
- **Required For:** Client-side database queries with RLS
- **GitHub Secret Name:** `SUPABASE_ANON_KEY`
- **Environment Variable:** `SUPABASE_ANON_KEY`

#### 16. `SUPABASE_SERVICE_ROLE_KEY`
- **Purpose:** Full database access (bypasses RLS)
- **Format:** JWT token (long eyJ... string)
- **Location:** Backend server ONLY
- **Exposure Level:** ⛔ NEVER expose in mobile app
- **Get From:** https://app.supabase.com/project/[project]/settings/api
- **Required For:** Backend admin operations
- **GitHub Secret Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Note:** Has full database access - backend only!

#### 17. `RESEND_API_KEY`
- **Purpose:** Transactional email sending via Resend
- **Format:** `re_...` token string
- **Location:** Backend server ONLY
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** https://resend.com/api-keys
- **Required For:** Sending emails from backend
- **GitHub Secret Name:** `RESEND_API_KEY`

#### 18. `OPENROUTER_API_KEY`
- **Purpose:** AI model API access via OpenRouter
- **Format:** `sk-or-v1-...` token string
- **Location:** Backend server ONLY
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** https://openrouter.ai/keys
- **Required For:** AI-powered features
- **GitHub Secret Name:** `OPENROUTER_API_KEY`

#### 19. `GOOGLE_MAPS_API_KEY`
- **Purpose:** Maps, geocoding, and location services
- **Format:** `AIza...` token string
- **Location:** Mobile app environment
- **Exposure Level:** 🔒 Restricted (use API restrictions)
- **Get From:** https://console.cloud.google.com/apis/credentials
- **Required For:** Maps integration
- **GitHub Secret Name:** `GOOGLE_MAPS_API_KEY`
- **Environment Variable:** `GOOGLE_MAPS_API_KEY`
- **Security:** Restrict to Android app bundle ID + SHA-1 fingerprint

#### 20. `MOTOR_DAAS_PUBLIC_KEY`
- **Purpose:** Motor DaaS API public key
- **Format:** Alphanumeric string
- **Location:** Mobile app environment
- **Exposure Level:** ✅ SAFE to expose (public key)
- **Get From:** Motor DaaS dashboard
- **Required For:** Vehicle data API
- **GitHub Secret Name:** `MOTOR_DAAS_PUBLIC_KEY`
- **Environment Variable:** `MOTOR_DAAS_PUBLIC_KEY`

#### 21. `MOTOR_DAAS_PRIVATE_KEY`
- **Purpose:** Motor DaaS API private key
- **Format:** Alphanumeric string with special characters
- **Location:** Backend server OR mobile app (check provider docs)
- **Exposure Level:** ⛔ NEVER expose publicly
- **Get From:** Motor DaaS dashboard
- **Required For:** Authenticated vehicle data requests
- **GitHub Secret Name:** `MOTOR_DAAS_PRIVATE_KEY`

#### 22. `AUTO_DEV_API_KEY`
- **Purpose:** Auto Dev API access
- **Format:** `sk_ad_...` token string
- **Location:** Backend server OR mobile app
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** Auto Dev provider
- **Required For:** Automotive development tools
- **GitHub Secret Name:** `AUTO_DEV_API_KEY`

#### 23. `HUGGING_FACE_API_KEY`
- **Purpose:** Hugging Face ML model access
- **Format:** `hf_...` token string
- **Location:** Backend server ONLY
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** https://huggingface.co/settings/tokens
- **Required For:** AI/ML model inference
- **GitHub Secret Name:** `HUGGING_FACE_API_KEY`

#### 24. `JWT_SECRET`
- **Purpose:** JWT token signing and verification
- **Format:** Long random hex string
- **Location:** Backend server ONLY
- **Exposure Level:** ⛔ NEVER expose
- **Get From:** Generate: `openssl rand -hex 32`
- **Required For:** User authentication tokens
- **GitHub Secret Name:** `JWT_SECRET`
- **Note:** Must be same across all backend instances

---

## 🏗 SECTION 2: GITHUB SECRETS CONFIGURATION

### Complete GitHub Secrets Summary Table

| # | Secret Name | Category | Required | Exposure Level | Where Used | Environment Variable |
|---|------------|----------|----------|----------------|------------|---------------------|
| 1 | `KEYSTORE_PASSWORD` | Build | ✅ Yes | Never Expose | GitHub Actions | - |
| 2 | `KEY_PASSWORD` | Build | ✅ Yes | Never Expose | GitHub Actions | - |
| 3 | `KEY_ALIAS` | Build | ✅ Yes | Private | GitHub Actions | - |
| 4 | `KEYSTORE_FILE_BASE64` | Build | ✅ Yes | Never Expose | GitHub Actions | - |
| 5 | `GOOGLE_SERVICE_ACCOUNT_JSON` | Build | ✅ Yes | Never Expose | GitHub Actions | - |
| 6 | `VERCEL_TOKEN` | Infrastructure | ⚠️ Optional | Never Expose | GitHub Actions | - |
| 7 | `VERCEL_PROJECT_ID` | Infrastructure | ⚠️ Optional | Private | GitHub Actions | - |
| 8 | `SSH_HOST` | Infrastructure | ⚠️ Optional | Private | GitHub Actions | - |
| 9 | `SSH_USERNAME` | Infrastructure | ⚠️ Optional | Private | GitHub Actions | - |
| 10 | `IONOS_PASSWORD` | Infrastructure | ⚠️ Optional | Never Expose | GitHub Actions | - |
| 11 | `EXPO_TOKEN` | Build | ⚠️ Optional | Never Expose | GitHub Actions | - |
| 12 | `STRIPE_PUBLISHABLE_KEY` | Payment | ✅ Yes | Safe | Mobile App | `STRIPE_PUBLISHABLE_KEY` |
| 13 | `STRIPE_SECRET_KEY` | Payment | ✅ Yes | Never Expose | Backend | - |
| 14 | `SUPABASE_URL` | Database | ✅ Yes | Safe | Mobile App | `SUPABASE_URL` |
| 15 | `SUPABASE_ANON_KEY` | Database | ✅ Yes | Safe | Mobile App | `SUPABASE_ANON_KEY` |
| 16 | `SUPABASE_SERVICE_ROLE_KEY` | Database | ✅ Yes | Never Expose | Backend | - |
| 17 | `RESEND_API_KEY` | Email | ⚠️ Optional | Never Expose | Backend | - |
| 18 | `OPENROUTER_API_KEY` | AI/ML | ⚠️ Optional | Never Expose | Backend | - |
| 19 | `GOOGLE_MAPS_API_KEY` | Maps | ✅ Yes | Restricted | Mobile App | `GOOGLE_MAPS_API_KEY` |
| 20 | `MOTOR_DAAS_PUBLIC_KEY` | API | ⚠️ Optional | Safe | Mobile App | `MOTOR_DAAS_PUBLIC_KEY` |
| 21 | `MOTOR_DAAS_PRIVATE_KEY` | API | ⚠️ Optional | Never Expose | Mobile/Backend | `MOTOR_DAAS_PRIVATE_KEY` |
| 22 | `AUTO_DEV_API_KEY` | API | ⚠️ Optional | Never Expose | Mobile/Backend | `AUTO_DEV_API_KEY` |
| 23 | `HUGGING_FACE_API_KEY` | AI/ML | ⚠️ Optional | Never Expose | Backend | - |
| 24 | `JWT_SECRET` | Auth | ✅ Yes | Never Expose | Backend | - |

### How to Add GitHub Secrets

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Enter the **Name** (exactly as shown above)
5. Enter the **Value** (the actual API key/secret)
6. Click **"Add secret"**
7. Repeat for all 24 secrets

---

## 🔄 SECTION 3: GITHUB ACTIONS CI/CD WORKFLOW

### Workflow File: `.github/workflows/android-build-release.yml`

Create this file in your repository to automate the build, sign, and release process:

```yaml
name: 🚀 Android Build & Release

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
  workflow_dispatch:
    inputs:
      release_type:
        description: 'Release type'
        required: true
        default: 'internal'
        type: choice
        options:
          - internal
          - alpha
          - beta
          - production

jobs:
  build-android:
    name: 📦 Build Android APK/AAB
    runs-on: ubuntu-latest

    env:
      # App Environment Variables (Safe to expose - injected into app)
      STRIPE_PUBLISHABLE_KEY: ${{ secrets.STRIPE_PUBLISHABLE_KEY }}
      SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
      SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      GOOGLE_MAPS_API_KEY: ${{ secrets.GOOGLE_MAPS_API_KEY }}
      MOTOR_DAAS_PUBLIC_KEY: ${{ secrets.MOTOR_DAAS_PUBLIC_KEY }}
      MOTOR_DAAS_PRIVATE_KEY: ${{ secrets.MOTOR_DAAS_PRIVATE_KEY }}
      AUTO_DEV_API_KEY: ${{ secrets.AUTO_DEV_API_KEY }}

    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      - name: ☕ Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: 📱 Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 📦 Install Dependencies
        run: npm ci

      - name: 🔧 Create .env File
        run: |
          echo "STRIPE_PUBLISHABLE_KEY=${{ secrets.STRIPE_PUBLISHABLE_KEY }}" >> .env
          echo "SUPABASE_URL=${{ secrets.SUPABASE_URL }}" >> .env
          echo "SUPABASE_ANON_KEY=${{ secrets.SUPABASE_ANON_KEY }}" >> .env
          echo "GOOGLE_MAPS_API_KEY=${{ secrets.GOOGLE_MAPS_API_KEY }}" >> .env
          echo "MOTOR_DAAS_PUBLIC_KEY=${{ secrets.MOTOR_DAAS_PUBLIC_KEY }}" >> .env
          echo "MOTOR_DAAS_PRIVATE_KEY=${{ secrets.MOTOR_DAAS_PRIVATE_KEY }}" >> .env
          echo "AUTO_DEV_API_KEY=${{ secrets.AUTO_DEV_API_KEY }}" >> .env

      - name: 🔐 Decode Keystore
        run: |
          echo "${{ secrets.KEYSTORE_FILE_BASE64 }}" | base64 --decode > android/app/release.keystore

      - name: 🔨 Build Release APK
        run: |
          cd android
          ./gradlew assembleRelease             -PKEYSTORE_FILE=release.keystore             -PKEYSTORE_PASSWORD="${{ secrets.KEYSTORE_PASSWORD }}"             -PKEY_ALIAS="${{ secrets.KEY_ALIAS }}"             -PKEY_PASSWORD="${{ secrets.KEY_PASSWORD }}"

      - name: 📦 Build Release AAB (Android App Bundle)
        run: |
          cd android
          ./gradlew bundleRelease             -PKEYSTORE_FILE=release.keystore             -PKEYSTORE_PASSWORD="${{ secrets.KEYSTORE_PASSWORD }}"             -PKEY_ALIAS="${{ secrets.KEY_ALIAS }}"             -PKEY_PASSWORD="${{ secrets.KEY_PASSWORD }}"

      - name: 📤 Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-release-apk
          path: android/app/build/outputs/apk/release/app-release.apk
          retention-days: 30

      - name: 📤 Upload AAB Artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-release-aab
          path: android/app/build/outputs/bundle/release/app-release.aab
          retention-days: 30

      - name: 🚀 Deploy to Google Play Store
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_JSON }}
          packageName: com.yourcompany.yourapp
          releaseFiles: android/app/build/outputs/bundle/release/app-release.aab
          track: ${{ github.event.inputs.release_type || 'internal' }}
          status: completed
          inAppUpdatePriority: 2
          whatsNewDirectory: distribution/whatsnew
```

### Workflow Triggers

- **Push to `main`:** Builds and deploys to Google Play (internal track)
- **Push to `develop`:** Builds only (no deployment)
- **Pull Request:** Builds for testing
- **Manual Dispatch:** Build and deploy to chosen track (internal/alpha/beta/production)

---

## 🔒 SECTION 4: SECURITY BEST PRACTICES

### Key Management Rules

#### ✅ DO:

1. **Store all secrets in GitHub Secrets** (never in code or version control)
2. **Use separate test/production keys** for all services
3. **Rotate keys quarterly** or immediately after any suspected exposure
4. **Enable 2FA** on all service accounts (GitHub, Google Play, AWS, etc.)
5. **Use API key restrictions** (IP whitelist, app bundle ID, SHA fingerprints)
6. **Implement least privilege access** (service accounts should have minimum required permissions)
7. **Audit secret access regularly** (check GitHub Actions logs)
8. **Use environment-specific secrets** (dev, staging, production)
9. **Document all secrets** in a secure location (password manager)
10. **Back up keystores** securely (encrypted cloud storage + offline backup)

#### ❌ DON'T:

1. **Hardcode keys in source code** (never commit secrets)
2. **Commit .env files to Git** (add to `.gitignore`)
3. **Share keys via email/Slack** (use secure password managers)
4. **Use production keys in development** (always use test keys locally)
5. **Reuse keys across multiple apps** (each app should have unique keys)
6. **Store secrets in plain text files** (always use encryption)
7. **Log secrets in console output** (sanitize logs)
8. **Expose service role keys in mobile apps** (backend only)

### Environment Variable Security Matrix

| Variable | Mobile App | Backend | GitHub Actions | Exposure Risk |
|----------|-----------|---------|----------------|---------------|
| `STRIPE_PUBLISHABLE_KEY` | ✅ | ✅ | ✅ | 🟢 Low (designed for client) |
| `STRIPE_SECRET_KEY` | ❌ | ✅ | ✅ | 🔴 Critical (server only) |
| `SUPABASE_URL` | ✅ | ✅ | ✅ | 🟢 Low (public URL) |
| `SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ | 🟢 Low (protected by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | ✅ | ✅ | 🔴 Critical (full access) |
| `GOOGLE_MAPS_API_KEY` | ✅ | ✅ | ✅ | 🟡 Medium (use restrictions) |
| `OPENROUTER_API_KEY` | ❌ | ✅ | ✅ | 🔴 Critical (paid service) |
| `KEYSTORE_PASSWORD` | ❌ | ❌ | ✅ | 🔴 Critical (signing only) |
| `JWT_SECRET` | ❌ | ✅ | ✅ | 🔴 Critical (auth bypass) |

### .gitignore Template

Ensure these files are **never** committed:

```gitignore
# Environment variables
.env
.env.local
.env.development
.env.production
.env.*.local

# Android signing
android/app/release.keystore
android/app/debug.keystore
android/keystore.properties
*.jks
*.keystore

# Sensitive JSON files
google-services.json
service-account.json
```

---

## 🎯 SECTION 5: QUICK START GUIDE

### Step 1: Generate Android Keystore

```bash
keytool -genkey -v -keystore release.keystore -alias release-key -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Encode Keystore to Base64

```bash
# macOS/Linux:
base64 -i release.keystore | pbcopy

# Windows (PowerShell):
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore")) | Set-Clipboard
```

### Step 3: Add All 24 Secrets to GitHub

1. Go to `https://github.com/[username]/[repo]/settings/secrets/actions`
2. Click **"New repository secret"**
3. Add each secret from the table in Section 2

### Step 4: Create Workflow File

1. Create `.github/workflows/android-build-release.yml`
2. Copy the workflow from Section 3
3. Update `packageName` to your app's package name
4. Commit and push

### Step 5: Test the Pipeline

1. Push code to `develop` branch
2. Monitor at `https://github.com/[username]/[repo]/actions`
3. Download and test the generated APK
4. If successful, merge to `main` for production deployment

---

## 📊 SECTION 6: VERIFICATION CHECKLIST

### Pre-Implementation
- [ ] Android keystore generated and backed up
- [ ] All 24 API keys collected
- [ ] Google Service Account created
- [ ] Service account granted Play Console access

### GitHub Configuration
- [ ] All 24 secrets added to GitHub
- [ ] Workflow file created
- [ ] `.gitignore` updated
- [ ] Package name updated in workflow

### Security
- [ ] No secrets in version control
- [ ] `.env` excluded from Git
- [ ] Keystore excluded from Git
- [ ] API restrictions configured

### Testing
- [ ] Local build successful
- [ ] CI/CD workflow completes
- [ ] APK generated and functional
- [ ] Play Store upload successful (if on main)

---

## 📚 SECTION 7: ADDITIONAL RESOURCES

### Official Documentation
- [GitHub Actions](https://docs.github.com/en/actions)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Google Play Console API](https://developers.google.com/android-publisher)
- [Stripe API Documentation](https://stripe.com/docs/api)

### Community Resources
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [r0adkll/upload-google-play](https://github.com/r0adkll/upload-google-play)

---

## 📝 VERSION HISTORY

### Version 3.0 (Current)
- **Date:** January 27, 2026
- **Changes:**
  - Expanded to universal blueprint for all Android apps
  - Added complete 24-secret inventory with detailed descriptions
  - Enhanced GitHub Actions workflow with multi-environment support
  - Added comprehensive security best practices
  - Included quick start guide and verification checklist

---

## 🎉 CONCLUSION

**Congratulations!** You now have a complete Universal PRD blueprint for automated Android app builds with GitHub Actions CI/CD!

**Status:** ✅ **APPROVED FOR UNIVERSAL USE**  
**Last Updated:** January 27, 2026  
**Document Version:** 3.0

---

**For questions or support, refer to the official documentation links above or open an issue in the template repository.**
