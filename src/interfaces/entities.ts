// Ce fichier définit tous les types de données de l'application.
// C'est le "contrat" que toute l'app respecte.

// Les 5 types d'entités possibles dans notre base de données
export type EntityType =
  | 'USER_PROFILE'  // Profil d'un utilisateur
  | 'TRACK'         // Un morceau de musique
  | 'PLAYLIST'      // Une playlist
  | 'HISTORY'       // L'historique d'écoute
  | 'OFFLINE_SYNC'; // Les morceaux téléchargés

// La structure de base de chaque ligne dans app_entities
export interface AppEntity {
  id: string;           // Identifiant unique (UUID généré par Supabase)
  user_id?: string;     // L'utilisateur propriétaire (optionnel pour les contenus publics)
  entity_type: EntityType;
  content: // Le contenu varie selon le type
    | UserProfileContent
    | TrackContent
    | PlaylistContent
    | HistoryContent
    | OfflineSyncContent;
  created_at: string;   // Date de création (format ISO)
  updated_at: string;   // Date de dernière modification
}

// ─── PROFIL UTILISATEUR ───────────────────────────────────────────
// Stocké quand un utilisateur se connecte pour la première fois
export interface UserProfileContent {
  display_name: string;          // Nom affiché dans l'app
  avatar_url: string | null;     // Photo de profil (peut être absente)
  provider: 'google' | 'github'; // Comment il s'est connecté
  account_tier: 'free' | 'premium'; // Compte gratuit ou payant
  explicit_content_allowed: boolean; // Autoriser les contenus explicites ?
  data_saver_mode: boolean;      // Mode économiseur de données activé ?
  audio_quality_settings: {
    streaming_cellular: 'low' | 'normal' | 'high';    // Qualité en 4G
    streaming_wifi: 'normal' | 'high' | 'very_high';  // Qualité en WiFi
    download: 'normal' | 'high' | 'very_high';        // Qualité des téléchargements
  };
  crossfade_duration_seconds: number; // Durée du fondu entre morceaux
}

// ─── MORCEAU DE MUSIQUE ───────────────────────────────────────────
// Une ligne de paroles synchronisée avec la musique
export interface LyricLine {
  time_ms: number; // À quel moment (en millisecondes) afficher cette ligne
  text: string;    // Le texte de la ligne
}

export interface TrackContent {
  title: string;
  artist: {
    id: string;
    name: string;
  };
  album: {
    id: string;
    title: string;
    cover_url: string; // URL de la pochette d'album
  };
  duration_seconds: number;
  remote_audio_url: string;       // URL du fichier MP3 sur Supabase Storage
  canvas_video_url?: string | null; // Vidéo d'arrière-plan (optionnel)
  is_explicit: boolean;           // Contenu explicite ?
  is_podcast: boolean;            // C'est un podcast ?
  genres: string[];               // Ex: ["hip-hop", "trap"]
  lyrics?: LyricLine[] | null;    // Paroles synchronisées (optionnel)
}

// ─── PLAYLIST ────────────────────────────────────────────────────
// Un morceau dans une playlist (avec qui l'a ajouté et quand)
export interface PlaylistTrack {
  track_id: string;  // L'ID du morceau (référence vers une entité TRACK)
  added_by: string;  // user_id de celui qui a ajouté ce morceau
  added_at: string;  // Date d'ajout (format ISO)
}

export interface PlaylistContent {
  title: string;
  description: string;
  is_public: boolean;           // Visible par tout le monde ?
  is_collaborative: boolean;    // Plusieurs personnes peuvent modifier ?
  cover_custom_url: string | null; // Pochette personnalisée
  collaborators: string[];      // Liste des user_id autorisés à modifier
  tracks: PlaylistTrack[];      // Les morceaux dans la playlist (dans l'ordre)
}

// ─── HISTORIQUE D'ÉCOUTE ─────────────────────────────────────────
export interface HistoryItem {
  track_id: string;  // Quel morceau a été écouté
  played_at: string; // Quand (format ISO)
}

export interface HistoryContent {
  recently_played: HistoryItem[]; // Les derniers morceaux écoutés
  player_state_persistence: {     // L'état du lecteur sauvegardé pour reprendre plus tard
    current_track_id: string | null; // Morceau en cours
    position_ms: number;             // Position dans le morceau (en ms)
    queue_track_ids: string[];        // File d'attente
    is_shuffle: boolean;             // Lecture aléatoire activée ?
    repeat_mode: 'off' | 'track' | 'context'; // Mode répétition
  };
}

// ─── SYNCHRONISATION HORS-LIGNE ──────────────────────────────────
export interface DownloadedTrack {
  track_id: string;        // Référence vers le TRACK en base
  local_file_path: string; // Chemin du fichier sur le téléphone
  downloaded_at: string;   // Date de téléchargement
  file_size_bytes: number; // Taille du fichier (pour gérer le stockage)
}

export interface OfflineSyncContent {
  downloaded_tracks: DownloadedTrack[]; // Tous les morceaux téléchargés
}