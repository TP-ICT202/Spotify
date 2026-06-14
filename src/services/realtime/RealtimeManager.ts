import { supabase } from '../../api/supabaseClient';

// ─── TYPES ───────────────────────────────────────────────────────

export interface FriendActivity {
  userId: string;
  displayName: string;
  trackId: string;
  trackTitle: string;
  artistName: string;
  timestamp: string;
}

// ─── GESTIONNAIRE REALTIME ───────────────────────────────────────

class RealtimeManager {
  private channel: any = null;

  // Diffuser son état de lecture à tous les amis connectés
  async broadcastListeningState(
    userId: string,
    displayName: string,
    trackId: string,
    trackTitle: string,
    artistName: string,
  ): Promise<void> {
    if (!this.channel) {
      console.warn('⚠️ Canal Realtime non initialisé');
      return;
    }

    await this.channel.track({
      userId,
      displayName,
      trackId,
      trackTitle,
      artistName,
      timestamp: new Date().toISOString(),
    });

    console.log(`📡 État diffusé : ${displayName} écoute ${trackTitle}`);
  }

  // S'abonner au canal et écouter l'activité des amis
  subscribeToFriendActivity(
    roomId: string,                                    // ID de la "salle" commune
    onFriendUpdate: (friends: FriendActivity[]) => void, // Callback quand un ami change
  ): void {
    // Créer le canal Supabase Presence
    // Presence = chaque utilisateur connecté partage son état en temps réel
    this.channel = supabase.channel(`friend_activity_${roomId}`, {
      config: { presence: { key: roomId } },
    });

    // Écouter les changements de présence
    this.channel
      .on('presence', { event: 'sync' }, () => {
        // Récupérer l'état de tous les utilisateurs connectés
        const state = this.channel.presenceState();

        // Convertir l'état en tableau d'activités
        const friends: FriendActivity[] = Object.values(state)
          .flat()
          .map((presence: any) => ({
            userId: presence.userId,
            displayName: presence.displayName,
            trackId: presence.trackId,
            trackTitle: presence.trackTitle,
            artistName: presence.artistName,
            timestamp: presence.timestamp,
          }));

        onFriendUpdate(friends);
      })
      .subscribe();

    console.log(`✅ Abonné au canal friend_activity_${roomId}`);
  }

  // Se déconnecter du canal
  async unsubscribe(): Promise<void> {
    if (this.channel) {
      await supabase.removeChannel(this.channel);
      this.channel = null;
      console.log('🔌 Déconnecté du canal Realtime');
    }
  }
}

// Singleton : une seule instance partagée par toute l'app
export const realtimeManager = new RealtimeManager();