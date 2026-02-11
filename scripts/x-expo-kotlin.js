// scripts/fix-expo-kotlin.js
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting Expo Kotlin Fix...');

// Path to the problematic build.gradle file in node_modules
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

  // Check if patch is needed (fixes the hardcoded kotlin version error)
  if (content.includes('ext.kotlinVersion =')) {
    console.log('✅ Patching build.gradle to use project-wide kotlinVersion...');
    
    // Replaces the hardcoded version with a check for the project's version
    const patchedContent = content.replace(
      /ext\.kotlinVersion = .*/g,
      "ext.kotlinVersion = (project.ext.has('kotlinVersion') ? project.ext.get('kotlinVersion') : '1.8.10')"
    );

    fs.writeFileSync(gradlePath, patchedContent);
    console.log('✨ build.gradle patched successfully!');
  } else {
    console.log('⚠️ kotlinVersion target not found or already patched.');
  }
} else {
  console.log('❌ Could not find build.gradle at:', gradlePath);
  console.log('This is normal if node_modules is not installed yet.');
}
