/**
 * @format
 */

import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { name as appName } from './app.json';

// Enregistrement du composant principal de l'app
AppRegistry.registerComponent(appName, () => App);

// Enregistrement du service de lecture en arrière-plan
// C'est obligatoire pour react-native-track-player
// Ce service continue de tourner même quand l'app est fermée
// Il gère les événements : bouton play/pause sur l'écran de verrouillage,
// écouteurs débranchés, appel téléphonique qui interrompt la musique, etc.
TrackPlayer.registerPlaybackService(() => require('./src/services/audio/PlaybackService'));