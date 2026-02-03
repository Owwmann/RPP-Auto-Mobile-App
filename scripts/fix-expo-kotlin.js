// scripts/fix-expo-kotlin.js
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting Expo Kotlin Version Patch...');

// Path to the problematic build.gradle file
const gradlePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-modules-core',
  'android',
  'build.gradle'
);

if (fs.existsSync(gradlePath)) {
  let content = fs.readFileSync(gradlePath, 'utf8');
  
  // Check if patch is needed
  if (content.includes('languageVersion = "1.8"') || content.includes("languageVersion = '1.8'")) {
    console.log('⚠️  Found outdated Kotlin 1.8 config. Patching to 1.9...');
    
    // THE FIX: Force regex replacement of version strings
    content = content.replace(/languageVersion\s*=\s*["']1\.8["']/g, 'languageVersion = "1.9"');
    content = content.replace(/apiVersion\s*=\s*["']1\.8["']/g, 'apiVersion = "1.9"');
    content = content.replace(/jvmTarget\s*=\s*["']1\.8["']/g, 'jvmTarget = "17"');
    
    // Write the patched content back
    fs.writeFileSync(gradlePath, content, 'utf8');
    console.log('✅ Successfully patched expo-modules-core to Kotlin 1.9');
  } else {
    console.log('ℹ️  File already patched or version not found.');
  }
} else {
  console.error('❌ Could not find expo-modules-core build.gradle at:', gradlePath);
  // Do not fail the build if the package is missing (might be cached), but warn loudly
}
