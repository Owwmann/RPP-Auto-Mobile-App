const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .cjs and .mjs extensions
config.resolver.sourceExts.push('cjs', 'mjs');

module.exports = config;
