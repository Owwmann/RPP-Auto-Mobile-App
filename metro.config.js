const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// COMPREHENSIVE FIX: Ensure Flow types are properly stripped from React Native core files
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

// Ensure proper source extension resolution
config.resolver = {
  ...config.resolver,
  sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
};

module.exports = config;
