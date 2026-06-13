import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  State,
  Track,
} from 'react-native-track-player';

// ─── INITIALISATION ──────────────────────────────────────────────
// Cette fonction est appelée UNE SEULE FOIS au démarrage de l'app
// Elle configure toutes les capacités du lecteur
export async function setupAudioEngine(): Promise<void> {
  try {
    // Initialise le lecteur audio
    await TrackPlayer.setupPlayer({
      // Taille du buffer audio (en secondes)
      // Plus c'est grand, moins il y a de coupures mais plus ça consomme de mémoire
      minBuffer: 15,
      maxBuffer: 50,
      playBuffer: 2.5,
    });

    // Configure les options du lecteur
    await TrackPlayer.updateOptions({
      // Que faire quand l'utilisateur tue l'app ?
      // STOP_PLAYBACK_AND_REMOVE_NOTIFICATION = arrêter la musique
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },

      // Les boutons disponibles sur la notification et l'écran de verrouillage
      capabilities: [
        Capability.Play,        // Bouton Play
        Capability.Pause,       // Bouton Pause
        Capability.SkipToNext,  // Bouton Suivant
        Capability.SkipToPrevious, // Bouton Précédent
        Capability.SeekTo,      // Glissière de progression
        Capability.Stop,        // Bouton Stop
      ],

      // Les boutons visibles sur la notification compacte
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],

      // Délai de progression (mise à jour de la position toutes les 500ms)
      progressUpdateEventInterval: 500,
    });

    console.log('✅ AudioEngine initialisé avec succès');
  } catch (error) {
    console.error('❌ Erreur initialisation AudioEngine:', error);
  }
}

// ─── LECTURE ─────────────────────────────────────────────────────

// Jouer une liste de morceaux (remplace la file d'attente actuelle)
export async function playTracks(tracks: Track[]): Promise<void> {
  try {
    // Vider la file d'attente actuelle
    await TrackPlayer.reset();
    // Ajouter les nouveaux morceaux
    await TrackPlayer.add(tracks);
    // Lancer la lecture
    await TrackPlayer.play();
  } catch (error) {
    console.error('❌ Erreur lecture:', error);
  }
}

// Jouer un seul morceau
export async function playTrack(track: Track): Promise<void> {
  await playTracks([track]);
}

// ─── CONTROLES DE BASE ───────────────────────────────────────────

export async function pauseAudio(): Promise<void> {
  await TrackPlayer.pause();
}

export async function resumeAudio(): Promise<void> {
  await TrackPlayer.play();
}

export async function skipToNext(): Promise<void> {
  await TrackPlayer.skipToNext();
}

export async function skipToPrevious(): Promise<void> {
  await TrackPlayer.skipToPrevious();
}

// Aller à une position précise dans le morceau (en secondes)
export async function seekTo(positionSeconds: number): Promise<void> {
  await TrackPlayer.seekTo(positionSeconds);
}

// ─── FILE D'ATTENTE ──────────────────────────────────────────────

// Ajouter un morceau à la fin de la file d'attente
export async function addToQueue(track: Track): Promise<void> {
  await TrackPlayer.add(track);
}

// Vider complètement la file d'attente et arrêter la lecture
export async function clearQueue(): Promise<void> {
  await TrackPlayer.reset();
}

// Récupérer toute la file d'attente actuelle
export async function getQueue(): Promise<Track[]> {
  return await TrackPlayer.getQueue();
}

// ─── MODES DE LECTURE ────────────────────────────────────────────

// Activer/désactiver la répétition
export async function setRepeatMode(mode: RepeatMode): Promise<void> {
  await TrackPlayer.setRepeatMode(mode);
}

// Mélanger aléatoirement la file d'attente
export async function shuffleQueue(): Promise<void> {
  const queue = await TrackPlayer.getQueue();
  const currentIndex = await TrackPlayer.getActiveTrackIndex();

  // On retire le morceau actuel de la liste à mélanger
  const currentTrack = queue[currentIndex ?? 0];
  const otherTracks = queue.filter((_, i) => i !== currentIndex);

  // Algorithme de mélange (Fisher-Yates)
  // Parcourt la liste de la fin vers le début
  // et échange chaque élément avec un élément aléatoire
  for (let i = otherTracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [otherTracks[i], otherTracks[j]] = [otherTracks[j], otherTracks[i]];
  }

  // Reconstruire la file : morceau actuel en premier, reste mélangé
  const shuffled = [currentTrack, ...otherTracks];
  await TrackPlayer.reset();
  await TrackPlayer.add(shuffled);
  await TrackPlayer.play();
}

// ─── ÉTAT DU LECTEUR ─────────────────────────────────────────────

// Récupérer la position actuelle en millisecondes
export async function getCurrentPositionMs(): Promise<number> {
  const position = await TrackPlayer.getProgress();
  return position.position * 1000; // Convertir secondes → millisecondes
}

// Vérifier si le lecteur est en train de jouer
export async function isPlaying(): Promise<boolean> {
  const state = await TrackPlayer.getPlaybackState();
  return state.state === State.Playing;
}

// Récupérer le morceau en cours de lecture
export async function getCurrentTrack(): Promise<Track | null> {
  const track = await TrackPlayer.getActiveTrack();
  return track ?? null;
}

// ─── VOLUME ──────────────────────────────────────────────────────

// Changer le volume (0.0 = muet, 1.0 = volume maximum)
export async function setVolume(volume: number): Promise<void> {
  // S'assurer que le volume est entre 0 et 1
  const clampedVolume = Math.max(0, Math.min(1, volume));
  await TrackPlayer.setVolume(clampedVolume);
}