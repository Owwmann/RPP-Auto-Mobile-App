module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
    ],
    plugins: [
      // TypeScript transform - CRITICAL for generic syntax
      ['@babel/plugin-transform-typescript', {
        isTSX: true,
        allExtensions: true,
      }],
      // React Native environment variables
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ]
  };
};
