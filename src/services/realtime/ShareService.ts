import Share from 'react-native-share';
import { TrackContent, PlaylistContent } from '../../interfaces/entities';

// ─── PARTAGE DE MORCEAUX ─────────────────────────────────────────

export async function shareTrack(
  trackId: string,
  content: TrackContent,
): Promise<void> {
  try {
    const deepLink = `spotifyclone://track/${trackId}`;

    await Share.open({
      title: `Écoute "${content.title}" sur VSpotify`,
      message: `Je t'envoie "${content.title}" de ${content.artist.name} 🎵\n${deepLink}`,
      // url: content.album.cover_url ?? undefined, // Optionnel : partager la pochette
    });

    console.log(`✅ Morceau ${content.title} partagé`);
  } catch (error) {
    // L'utilisateur a annulé le partage → pas une vraie erreur
    console.log('Partage annulé');
  }
}

// ─── PARTAGE DE PLAYLISTS ────────────────────────────────────────

export async function sharePlaylist(
  playlistId: string,
  content: PlaylistContent,
): Promise<void> {
  try {
    const deepLink = `spotifyclone://playlist/${playlistId}`;

    await Share.open({
      title: `Playlist "${content.title}" sur VSpotify`,
      message: `Découvre ma playlist "${content.title}" sur VSpotify 🎶\n${deepLink}`,
    });

    console.log(`✅ Playlist ${content.title} partagée`);
  } catch (error) {
    console.log('Partage annulé');
  }
}