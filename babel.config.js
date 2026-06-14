module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      safe: false,
      allowUndefined: true,
    }],
    // react-native-reanimated doit TOUJOURS être en dernier
    'react-native-reanimated/plugin',
  ],
};