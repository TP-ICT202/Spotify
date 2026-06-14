module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',       // Comment on importe les variables dans le code
      path: '.env',             // Le fichier qui contient les variables
      safe: false,              // Ne pas bloquer si une variable manque
      allowUndefined: true,     // Autoriser les variables non définies
    }],
  ],
};