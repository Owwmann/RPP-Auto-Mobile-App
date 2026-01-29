#!/bin/bash
echo "🚀 Starting TCL Android 2025 Configuration Fix..."

# --- FIX 1: PATCH MAIN EXPO MODULE (CRITICAL) ---
EXPO_BUILD="node_modules/expo/android/build.gradle"
if [ -f "$EXPO_BUILD" ]; then
    echo "📍 Found :expo module. Injecting SDK 34 config..."
    # Create a temporary file with the SDK config at the top
    echo "android {
    compileSdkVersion 34
    defaultConfig {
        minSdkVersion 23
        targetSdkVersion 34
    }
}" > temp_header.gradle

    # Append the original file content to the header
    cat "$EXPO_BUILD" >> temp_header.gradle
    # Overwrite the original file
    mv temp_header.gradle "$EXPO_BUILD"
    echo "✅ :expo module patched successfully."
else
    echo "❌ ERROR: :expo build.gradle not found!"
    exit 1
fi

# --- FIX 2: PATCH PLUGIN COMPONENT ACCESS ---
PLUGIN_FILE="node_modules/expo-modules-core/android/ExpoModulesCorePlugin.gradle"
if [ -f "$PLUGIN_FILE" ]; then
    echo "📍 Patching ExpoModulesCorePlugin.gradle..."
    # Safe replacement using perl to avoid sed compatibility issues
    perl -pi -e 's/components\.release/components.findByName("release")/g' "$PLUGIN_FILE"
    echo "✅ Plugin patched to prevent MissingPropertyException."
fi

# --- FIX 3: GLOBAL SDK 34 SWEEP ---
echo "📍 Scanning all other modules for missing SDK config..."
find node_modules -path "*/android/build.gradle" -type f | while read file; do
    if ! grep -q "compileSdkVersion" "$file"; then
        # Append config to the end of the android block if missing
        sed -i '/android {/a\    compileSdkVersion 34\n    defaultConfig {\n        minSdkVersion 23\n        targetSdkVersion 34\n    }' "$file"
        echo "✅ Updated legacy module: $file"
    fi
done

echo "✅ CONFIGURATION FIX COMPLETE."
