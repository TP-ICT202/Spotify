import RNFS from 'react-native-fs';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import { TrackContent } from '../../interfaces/entities';

// ─── TYPES LOCAUX ────────────────────────────────────────────────

// Un morceau local a la même structure que TrackContent
// mais avec des infos supplémentaires sur le fichier physique
export interface LocalTrack {
  id: string;              // On génère un ID basé sur le chemin du fichier
  filePath: string;        // Chemin absolu sur le téléphone
  fileExtension: string;   // mp3, wav, flac, m4a
  fileSizeBytes: number;   // Taille du fichier
  content: TrackContent;   // Métadonnées au format standard de l'app
}

// ─── PERMISSIONS ─────────────────────────────────────────────────

// Demander la permission de lire les fichiers audio
// Android 13+ utilise READ_MEDIA_AUDIO
// Android 12 et moins utilise READ_EXTERNAL_STORAGE
export async function requestStoragePermission(): Promise<boolean> {
  try {
    // Détecter la version d'Android
    const androidVersion = Platform.Version as number;

    const permission =
      androidVersion >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_AUDIO        // Android 13+
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;  // Android 12-

    // Vérifier d'abord si la permission est déjà accordée
    const currentStatus = await check(permission);

    if (currentStatus === RESULTS.GRANTED) {
      console.log('✅ Permission stockage déjà accordée');
      return true;
    }

    // Sinon demander la permission à l'utilisateur
    const result = await request(permission);
    const granted = result === RESULTS.GRANTED;

    if (granted) {
      console.log('✅ Permission stockage accordée par l\'utilisateur');
    } else {
      console.log('❌ Permission stockage refusée');
    }

    return granted;
  } catch (error) {
    console.error('❌ Erreur vérification permission:', error);
    return false;
  }
}

// ─── UTILITAIRES ─────────────────────────────────────────────────

// Extensions de fichiers audio supportées
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.flac', '.m4a'];

// Vérifier si un fichier est un fichier audio
function isAudioFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return AUDIO_EXTENSIONS.some(ext => lower.endsWith(ext));
}

// Générer un ID unique basé sur le chemin du fichier
// On utilise le chemin car il est unique sur chaque téléphone
function generateLocalId(filePath: string): string {
  return 'local_' + filePath.replace(/[^a-zA-Z0-9]/g, '_');
}

// Extraire l'extension d'un fichier
function getExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? 'mp3';
}

// Nettoyer le nom du fichier pour en faire un titre lisible
// Ex: "01_-_Titre_Du_Morceau.mp3" → "Titre Du Morceau"
function cleanFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')        // Supprimer l'extension
    .replace(/^\d+[-_\s.]+/, '')    // Supprimer les numéros au début (01-, 02.)
    .replace(/[-_]/g, ' ')          // Remplacer - et _ par des espaces
    .trim();
}

// ─── SCAN D'UN DOSSIER ───────────────────────────────────────────

// Scanner récursivement un dossier et retourner tous les fichiers audio trouvés
async function scanDirectory(dirPath: string): Promise<LocalTrack[]> {
  const tracks: LocalTrack[] = [];

  try {
    // Vérifier si le dossier existe sur ce téléphone
    const exists = await RNFS.exists(dirPath);
    if (!exists) {
      console.log(`📁 Dossier inexistant, ignoré : ${dirPath}`);
      return [];
    }

    // Lire le contenu du dossier
    const items = await RNFS.readDir(dirPath);

    for (const item of items) {
      if (item.isDirectory()) {
        // Si c'est un sous-dossier, on le scanne aussi (récursion)
        const subTracks = await scanDirectory(item.path);
        tracks.push(...subTracks);

      } else if (item.isFile() && isAudioFile(item.name)) {
        // C'est un fichier audio !
        // On construit un objet LocalTrack avec les infos disponibles
        const localTrack: LocalTrack = {
          id: generateLocalId(item.path),
          filePath: item.path,
          fileExtension: getExtension(item.name),
          fileSizeBytes: item.size,
          content: {
            // Sans parseur de métadonnées ID3, on utilise le nom du fichier
            title: cleanFilename(item.name),
            artist: {
              id: 'local',
              name: 'Artiste inconnu', // Sera mis à jour si on lit les métadonnées
            },
            album: {
              id: 'local',
              title: 'Album inconnu',
              cover_url: '', // Pas de pochette par défaut
            },
            duration_seconds: 0, // Sera calculé par le lecteur audio
            remote_audio_url: `file://${item.path}`, // Chemin local préfixé par file://
            canvas_video_url: null,
            is_explicit: false,
            is_podcast: false,
            genres: [],
            lyrics: null,
          },
        };

        tracks.push(localTrack);
      }
    }
  } catch (error) {
    console.error(`❌ Erreur scan du dossier ${dirPath}:`, error);
  }

  return tracks;
}

// ─── SCAN PRINCIPAL ──────────────────────────────────────────────

// Scanner tous les dossiers musicaux du téléphone
export async function scanLocalMusic(): Promise<LocalTrack[]> {
  console.log('🔍 Début du scan de la musique locale...');

  // Demander la permission avant de scanner
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    console.log('❌ Scan annulé : permission refusée');
    return [];
  }

  // Les dossiers à scanner sur Android
  // RNFS.ExternalStorageDirectoryPath = /storage/emulated/0
  const foldersToScan = [
    `${RNFS.ExternalStorageDirectoryPath}/Music`,
    `${RNFS.ExternalStorageDirectoryPath}/Download`,
    `${RNFS.ExternalStorageDirectoryPath}/Downloads`,
    `${RNFS.ExternalStorageDirectoryPath}/Musique`, // Pour les téléphones en français
  ];

  const allTracks: LocalTrack[] = [];

  // Scanner chaque dossier
  for (const folder of foldersToScan) {
    console.log(`📂 Scan de : ${folder}`);
    const tracks = await scanDirectory(folder);
    console.log(`   → ${tracks.length} fichier(s) trouvé(s)`);
    allTracks.push(...tracks);
  }

  // Supprimer les doublons (même fichier détecté deux fois)
  const unique = allTracks.filter(
    (track, index, self) =>
      index === self.findIndex(t => t.filePath === track.filePath)
  );

  console.log(`✅ Scan terminé : ${unique.length} morceau(x) local/locaux trouvé(s)`);
  return unique;
}