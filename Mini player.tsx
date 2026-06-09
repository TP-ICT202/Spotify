import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SpotifyTheme } from '../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FullScreenPlayerProps {
  onClose: () => void;
  translateY: Animated.SharedValue<number>;
  snapTop: number;
  snapBottom: number;
}

export default function FullScreenPlayer({ onClose, translateY, snapTop, snapBottom }: FullScreenPlayerProps) {
  
  // Rendre le plein écran visible uniquement lors du drag vers le haut
  const fullScreenOpacity = useAnimatedStyle(() => {
    const opacity = 1 - (translateY.value - snapTop) / (snapBottom - snapTop);
    return { opacity: opacity };
  });

  return (
    <Animated.View style={[styles.container, fullScreenOpacity]} pointerEvents="box-none">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.chevron}>⌃</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>En cours de lecture</Text>
        <Text style={styles.menuDots}>•••</Text>
      </View>

      {/* Pochette d'album */}
      <View style={styles.albumContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500' }} 
          style={styles.largeAlbumArt} 
        />
      </View>

      {/* Infos Morceau */}
      <View style={styles.metaContainer}>
        <View>
          <Text style={styles.title}>Blinding Lights</Text>
          <Text style={styles.artist}>The Weeknd</Text>
        </View>
        <Text style={styles.heartIcon}>♡</Text>
      </View>

      {/* Barre de progression factice */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '35%' }]} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>1:12</Text>
          <Text style={styles.timeText}>3:20</Text>
        </View>
      </View>

      {/* Boutons de contrôle */}
      <View style={styles.controlsContainer}>
        <Text style={styles.secondaryControl}>🔀</Text>
        <Text style={styles.mainControl}>⏮</Text>
        <TouchableOpacity style={styles.playPauseButton}>
          <Text style={styles.playIcon}>⏸</Text>
        </TouchableOpacity>
        <Text style={styles.mainControl}>⏭</Text>
        <Text style={styles.secondaryControl}>🔁</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#191919', // Peut être hydraté dynamiquement via react-native-image-colors
    paddingTop: 60,
    paddingHorizontal: SpotifyTheme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    transform: [{ rotate: '180deg' }],
  },
  chevron: {
    fontSize: 24,
    color: SpotifyTheme.colors.text,
  },
  headerTitle: {
    color: SpotifyTheme.colors.text,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  menuDots: {
    color: SpotifyTheme.colors.text,
    fontSize: 18,
  },
  albumContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  largeAlbumArt: {
    width: SCREEN_WIDTH - 64,
    height: SCREEN_WIDTH - 64,
    borderRadius: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: SpotifyTheme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  artist: {
    color: SpotifyTheme.colors.textMuted,
    fontSize: 16,
    marginTop: 4,
  },
  heartIcon: {
    color: SpotifyTheme.colors.text,
    fontSize: 24,
  },
  progressContainer: {
    marginTop: SpotifyTheme.spacing.xl,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: SpotifyTheme.colors.text,
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SpotifyTheme.spacing.sm,
  },
  timeText: {
    color: SpotifyTheme.colors.textMuted,
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SpotifyTheme.spacing.xl,
  },
  mainControl: {
    color: SpotifyTheme.colors.text,
    fontSize: 32,
  },
  secondaryControl: {
    color: SpotifyTheme.colors.textMuted,
    fontSize: 20,
  },
  playPauseButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: SpotifyTheme.colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: SpotifyTheme.colors.black,
    fontSize: 28,
  },
});
