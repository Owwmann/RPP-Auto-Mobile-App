module.exports = {
  project: {
    android: {
      sourceDir: './android',
    },
  },
  dependencies: {
    // Force all Expo modules to use the correct SDK settings
    '@config-plugins/react-native-webrtc': {
      platforms: {
        android: null,
      },
    },
  },
};
