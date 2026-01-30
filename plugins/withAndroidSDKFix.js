const { AndroidConfig, withDangerousMod } = require('@expo/config-plugins');

module.exports = function withAndroidSDKFix(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      // This runs after prebuild generates the android folder
      const fs = require('fs');
      const path = require('path');
      
      // Path to expo-constants build.gradle
      const buildGradlePath = path.join(
        config.modRequest.platformProjectRoot,
        '..',
        'node_modules',
        'expo-constants',
        'android',
        'build.gradle'
      );
      
      if (fs.existsSync(buildGradlePath)) {
        let content = fs.readFileSync(buildGradlePath, 'utf-8');
        
        // Only add if not already present
        if (!content.includes('compileSdkVersion')) {
          // Add SDK configuration after 'android {'
          content = content.replace(
            /android\s*\{/,
            `android {
    compileSdkVersion 34
    
    defaultConfig {
        minSdkVersion 24
        targetSdkVersion 34
    }`
          );
          
          fs.writeFileSync(buildGradlePath, content, 'utf-8');
          console.log('✅ Fixed expo-constants SDK configuration');
        }
      }
      
      return config;
    },
  ]);
};
