module.exports = {
  name: "RPP Auto Mobile",
  slug: "rpp-auto-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.rppauto.app"
  },
  android: {
    package: "com.rppauto.app",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    },
    // CRITICAL: Configure Android SDK versions for Gradle 8 compatibility
    compileSdkVersion: 34,
    targetSdkVersion: 34,
    minSdkVersion: 24,
    buildToolsVersion: "34.0.0"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    "expo-build-properties"
  ],
  extra: {
    eas: {
      projectId: "" // Add your EAS project ID here if using EAS Build
    }
  }
};
