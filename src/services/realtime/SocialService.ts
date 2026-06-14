import { supabase } from '../../api/supabaseClient';
import { realtimeManager, FriendActivity } from './RealtimeManager';

// ─── ACTIVITÉ DES AMIS ───────────────────────────────────────────

// Démarrer l'écoute de l'activité des amis
export function startFriendActivityListener(
  userId: string,
  onUpdate: (friends: FriendActivity[]) => void,
): void {
  // On utilise l'ID utilisateur comme identifiant de salle
  // Dans une vraie app, ce serait un groupe d'amis spécifique
  realtimeManager.subscribeToFriendActivity(userId, onUpdate);
}

// Arrêter l'écoute
export async function stopFriendActivityListener(): Promise<void> {
  await realtimeManager.unsubscribe();
}

// Diffuser ce qu'on écoute aux amis
export async function broadcastCurrentTrack(
  userId: string,
  displayName: string,
  trackId: string,
  trackTitle: string,
  artistName: string,
): Promise<void> {
  await realtimeManager.broadcastListeningState(
    userId,
    displayName,
    trackId,
    trackTitle,
    artistName,
  );
}

// ─── PLAYLISTS COLLABORATIVES ────────────────────────────────────

// S'abonner aux changements d'une playlist en temps réel
export function subscribeToPlaylist(
  playlistId: string,
  onUpdate: (playlist: any) => void,
): () => void {
  // Supabase Broadcast = envoyer des messages à tous les abonnés d'un canal
  const channel = supabase.channel(`playlist_${playlistId}`);

  channel
    .on('broadcast', { event: 'playlist_updated' }, (payload) => {
      console.log(`🔄 Playlist ${playlistId} mise à jour`);
      onUpdate(payload.payload);
    })
    .subscribe();

  // Retourner une fonction de nettoyage
  return () => {
    supabase.removeChannel(channel);
  };
}

// Diffuser une mise à jour de playlist à tous les collaborateurs
export async function broadcastPlaylistUpdate(
  playlistId: string,
  updatedPlaylist: any,
): Promise<void> {
  const channel = supabase.channel(`playlist_${playlistId}`);

  await channel.send({
    type: 'broadcast',
    event: 'playlist_updated',
    payload: updatedPlaylist,
  });

  console.log(`📡 Mise à jour playlist ${playlistId} diffusée`);
}