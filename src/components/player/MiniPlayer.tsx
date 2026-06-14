import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { usePlayerStore } from '../../store/playerStore';
import { TrackContent } from '../../interfaces/entities';

export default function MiniPlayer(): React.JSX.Element | null {
  const { currentTrack, isPlaying, setIsPlaying } = usePlayerStore();

  if (!currentTrack) return null;

  const content = currentTrack.content as TrackContent;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>

        {/* Pochette */}
        {content.album.cover_url ? (
          <Image
            source={{ uri: content.album.cover_url }}
            style={styles.cover}
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.coverPlaceholderText}>🎵</Text>
          </View>
        )}

        {/* Infos */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {content.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {content.artist.name}
          </Text>
        </View>

        {/* Boutons */}
        // Remplace les deux TouchableOpacity des contrôles par :
        <View style={styles.controls}>
            <TouchableOpacity
            onPress={() => setIsPlaying(!isPlaying)}
            style={styles.controlButton}>
            {isPlaying ? (
                // Icône pause : deux barres verticales
                <View style={styles.pauseIcon}>
                    <View style={styles.pauseBar} />
                    <View style={styles.pauseBar} />
                </View>
            ) : (
            // Icône play : triangle
            <Text style={styles.playIcon}>▶</Text>
            )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.playIcon}>⏭</Text>
        </TouchableOpacity>
        </View>
      </View>

      {/* Barre de progression verte en bas */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 62,
    left: 8,
    right: 8,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cover: {
    width: 42,
    height: 42,
    borderRadius: 6,
    marginRight: 10,
  },
  coverPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 6,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  coverPlaceholderText: {
    fontSize: 20,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trackArtist: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  controlButton: {
    padding: 8,
  },
  controlIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: undefined,
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 4,
  },
  pauseBar: {
    width: 4,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  playIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#333',
  },
  progressFill: {
    height: 3,
    backgroundColor: '#1DB954',
    width: '30%',
  },
});