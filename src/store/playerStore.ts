import { create } from 'zustand';
import { TrackContent } from '../interfaces/entities';

// Structure du morceau dans le store
export interface PlayerTrack {
  id: string;
  content: TrackContent;
}

// Structure de l'état global du lecteur
interface PlayerState {
  // ─── ÉTAT ──────────────────────────────────────────
  currentTrack: PlayerTrack | null;  // Morceau en cours
  isPlaying: boolean;                // En train de jouer ?
  queue: PlayerTrack[];              // File d'attente
  isShuffle: boolean;                // Lecture aléatoire
  repeatMode: 'off' | 'track' | 'context'; // Répétition

  // ─── ACTIONS ───────────────────────────────────────
  setCurrentTrack: (track: PlayerTrack) => void;
  setIsPlaying: (playing: boolean) => void;
  setQueue: (queue: PlayerTrack[]) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playTrack: (track: PlayerTrack) => void; // Jouer un morceau
  clearPlayer: () => void;                 // Réinitialiser
}

export const usePlayerStore = create<PlayerState>((set) => ({
  // ─── VALEURS INITIALES ─────────────────────────────
  currentTrack: null,
  isPlaying: false,
  queue: [],
  isShuffle: false,
  repeatMode: 'off',

  // ─── IMPLÉMENTATION DES ACTIONS ────────────────────
  setCurrentTrack: (track) => set({ currentTrack: track }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setQueue: (queue) => set({ queue }),

  toggleShuffle: () => set((state) => ({
    isShuffle: !state.isShuffle,
  })),

  toggleRepeat: () => set((state) => {
    // Cycle : off → track → context → off
    const next = {
      off: 'track',
      track: 'context',
      context: 'off',
    } as const;
    return { repeatMode: next[state.repeatMode] };
  }),

  // Jouer un morceau : le définir comme actuel et lancer la lecture
  playTrack: (track) => set({
    currentTrack: track,
    isPlaying: true,
  }),

  clearPlayer: () => set({
    currentTrack: null,
    isPlaying: false,
    queue: [],
  }),
}));