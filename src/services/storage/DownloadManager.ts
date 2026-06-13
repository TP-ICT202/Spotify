import RNFS from 'react-native-fs';
import { DownloadedTrack } from '../../interfaces/entities';

// ─── CONFIGURATION ───────────────────────────────────────────────

// Dossier où on stocke les morceaux téléchargés
// DocumentDirectoryPath = dossier privé de l'app, inaccessible aux autres apps
const DOWNLOAD_DIR = `${RNFS.DocumentDirectoryPath}/offline_tracks`;

// Clé XOR pour l'obfuscation (nombre entre 1 et 255)
// XOR avec la même clé deux fois redonne le fichier original
// C'est une protection simple contre l'extraction basique
const XOR_KEY = 137;

// Extension qu'on donne aux fichiers obfusqués
// .vsp = VSpotify, ça ressemble pas à un MP3 donc difficile à extraire
const OBFUSCATED_EXTENSION = '.vsp';

// ─── INITIALISATION ──────────────────────────────────────────────

// Créer le dossier de téléchargements s'il n'existe pas encore
export async function initDownloadDirectory(): Promise<void> {
  try {
    const exists = await RNFS.exists(DOWNLOAD_DIR);
    if (!exists) {
      await RNFS.mkdir(DOWNLOAD_DIR);
      console.log('✅ Dossier de téléchargements créé');
    }
  } catch (error) {
    console.error('❌ Erreur création dossier téléchargements:', error);
  }
}

// ─── OBFUSCATION XOR ─────────────────────────────────────────────

// Comment fonctionne XOR :
// Octet original : 10110101
// Clé XOR        : 10001001  (137 en binaire)
// Résultat XOR   : 00111100  ← fichier obfusqué
// XOR à nouveau  : 10110101  ← on retrouve l'original !

// Obfusquer un fichier (MP3 → .vsp)
async function obfuscateFile(
  sourcePath: string,  // Chemin du fichier original téléchargé
  destPath: string,    // Chemin du fichier obfusqué à créer
): Promise<void> {
  // Lire le fichier en base64
  const base64Content = await RNFS.readFile(sourcePath, 'base64');

  // Convertir base64 en tableau d'octets
  const binaryString = atob(base64Content);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Appliquer XOR sur chaque octet
  const obfuscated = bytes.map(byte => byte ^ XOR_KEY);

  // Reconvertir en base64
  let obfuscatedBinary = '';
  obfuscated.forEach(byte => {
    obfuscatedBinary += String.fromCharCode(byte);
  });
  const obfuscatedBase64 = btoa(obfuscatedBinary);

  // Écrire le fichier obfusqué
  await RNFS.writeFile(destPath, obfuscatedBase64, 'base64');
}

// Désobfusquer un fichier (.vsp → données audio lisibles)
// Utilisé par le lecteur audio pour lire un fichier hors-ligne
export async function deobfuscateFile(
  obfuscatedPath: string, // Chemin du fichier .vsp
  outputPath: string,     // Chemin du fichier temporaire déchiffré
): Promise<string> {
  // Lire le fichier obfusqué
  const base64Content = await RNFS.readFile(obfuscatedPath, 'base64');

  // Convertir en octets
  const binaryString = atob(base64Content);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // XOR à nouveau = fichier original (XOR est son propre inverse)
  const deobfuscated = bytes.map(byte => byte ^ XOR_KEY);

  // Reconvertir en base64
  let binary = '';
  deobfuscated.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  const originalBase64 = btoa(binary);

  // Écrire le fichier temporaire
  await RNFS.writeFile(outputPath, originalBase64, 'base64');

  return outputPath;
}

// ─── TÉLÉCHARGEMENT ──────────────────────────────────────────────

export interface DownloadProgress {
  trackId: string;
  bytesWritten: number;
  contentLength: number;
  percentage: number; // 0 à 100
}

// Télécharger un morceau depuis Supabase Storage
export async function downloadTrack(
  trackId: string,
  remoteUrl: string,                              // URL Supabase Storage
  onProgress?: (progress: DownloadProgress) => void, // Callback progression
): Promise<DownloadedTrack | null> {
  try {
    await initDownloadDirectory();

    // Chemin temporaire pour le téléchargement (fichier MP3 brut)
    const tempPath = `${DOWNLOAD_DIR}/${trackId}_temp.mp3`;
    // Chemin final obfusqué
    const finalPath = `${DOWNLOAD_DIR}/${trackId}${OBFUSCATED_EXTENSION}`;

    // Vérifier si le morceau est déjà téléchargé
    const alreadyExists = await RNFS.exists(finalPath);
    if (alreadyExists) {
      console.log(`⏭️ Morceau ${trackId} déjà téléchargé`);
      const stat = await RNFS.stat(finalPath);
      return {
        track_id: trackId,
        local_file_path: finalPath,
        downloaded_at: new Date().toISOString(),
        file_size_bytes: stat.size,
      };
    }

    console.log(`⬇️ Téléchargement de ${trackId}...`);

    // Lancer le téléchargement avec suivi de progression
    const download = RNFS.downloadFile({
      fromUrl: remoteUrl,
      toFile: tempPath,
      progress: (res) => {
        const percentage = Math.round(
          (res.bytesWritten / res.contentLength) * 100
        );
        onProgress?.({
          trackId,
          bytesWritten: res.bytesWritten,
          contentLength: res.contentLength,
          percentage,
        });
      },
      progressDivider: 1, // Mise à jour à chaque % de progression
    });

    // Attendre la fin du téléchargement
    const result = await download.promise;

    if (result.statusCode !== 200) {
      throw new Error(`Téléchargement échoué : HTTP ${result.statusCode}`);
    }

    console.log(`✅ Téléchargement terminé, obfuscation en cours...`);

    // Obfusquer le fichier téléchargé
    await obfuscateFile(tempPath, finalPath);

    // Supprimer le fichier temporaire non obfusqué
    await RNFS.unlink(tempPath);

    // Récupérer la taille du fichier final
    const stat = await RNFS.stat(finalPath);

    const downloadedTrack: DownloadedTrack = {
      track_id: trackId,
      local_file_path: finalPath,
      downloaded_at: new Date().toISOString(),
      file_size_bytes: stat.size,
    };

    console.log(`✅ Morceau ${trackId} téléchargé et sécurisé`);
    return downloadedTrack;

  } catch (error) {
    console.error(`❌ Erreur téléchargement ${trackId}:`, error);
    return null;
  }
}

// ─── SUPPRESSION ─────────────────────────────────────────────────

// Supprimer un morceau téléchargé
export async function deleteDownloadedTrack(
  trackId: string,
): Promise<boolean> {
  try {
    const filePath = `${DOWNLOAD_DIR}/${trackId}${OBFUSCATED_EXTENSION}`;
    const exists = await RNFS.exists(filePath);

    if (!exists) {
      console.log(`⚠️ Fichier ${trackId} introuvable`);
      return false;
    }

    await RNFS.unlink(filePath);
    console.log(`🗑️ Morceau ${trackId} supprimé`);
    return true;

  } catch (error) {
    console.error(`❌ Erreur suppression ${trackId}:`, error);
    return false;
  }
}

// ─── VÉRIFICATIONS ───────────────────────────────────────────────

// Vérifier si un morceau est disponible hors-ligne
export async function isTrackDownloaded(trackId: string): Promise<boolean> {
  const filePath = `${DOWNLOAD_DIR}/${trackId}${OBFUSCATED_EXTENSION}`;
  return await RNFS.exists(filePath);
}

// Calculer l'espace total utilisé par les téléchargements (en octets)
export async function getDownloadedSize(): Promise<number> {
  try {
    const exists = await RNFS.exists(DOWNLOAD_DIR);
    if (!exists) return 0;

    const files = await RNFS.readDir(DOWNLOAD_DIR);
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    return totalBytes;

  } catch (error) {
    console.error('❌ Erreur calcul taille téléchargements:', error);
    return 0;
  }
}

// Supprimer TOUS les téléchargements (nettoyage complet)
export async function clearAllDownloads(): Promise<void> {
  try {
    const exists = await RNFS.exists(DOWNLOAD_DIR);
    if (!exists) return;

    // Supprimer le dossier entier et le recréer vide
    await RNFS.unlink(DOWNLOAD_DIR);
    await RNFS.mkdir(DOWNLOAD_DIR);
    console.log('🗑️ Tous les téléchargements supprimés');

  } catch (error) {
    console.error('❌ Erreur nettoyage téléchargements:', error);
  }
}