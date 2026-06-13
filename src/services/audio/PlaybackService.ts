import TrackPlayer, { Event } from 'react-native-track-player';

// Ce service tourne en arrière-plan
// Il écoute les événements et réagit en conséquence
module.exports = async function () {

  // Bouton Play appuyé (notification ou écouteurs)
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  // Bouton Pause appuyé
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  // Bouton Suivant appuyé
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  // Bouton Précédent appuyé
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  // Bouton Stop appuyé
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  // L'utilisateur a glissé la barre de progression
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    TrackPlayer.seekTo(event.position);
  });

  // Écouteurs débranchés → on met en pause automatiquement
  // (comportement standard de Spotify)
  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    if (event.paused) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  });
};