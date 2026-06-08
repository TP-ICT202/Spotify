import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { SpotifyTheme } from '../theme/theme';
import FullScreenPlayer from './FullScreenPlayer';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIN_PLAYER_HEIGHT = 60;
const TAB_BAR_HEIGHT = 60;
// Position ancrée juste au-dessus de la TabBar
const SNAP_BOTTOM = -(TAB_BAR_HEIGHT + MIN_PLAYER_HEIGHT + 10); 
// Position plein écran
const SNAP_TOP = -SCREEN_HEIGHT;

export default function MiniPlayer() {
  const translateY = useSharedValue(SNAP_BOTTOM);
  const contextY = useSharedValue(0);

  // Fonction fictive pour le changement de morceau (Swipe Latéral)
  const handleTrackChange = (direction: 'next' | 'prev') => {
    console.log(`Changement de morceau : ${direction}`);
  };

  // GESTE VERTICAL : Swipe Up / Down pour ouvrir/fermer le lecteur complet
  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextY.value = translateY.value;
    })
    .onUpdate((event) => {
      let nextY = contextY.value + event.translationY;
      // Empêcher de descendre plus bas que l'ancre initiale
      if (nextY > SNAP_BOTTOM) nextY = SNAP_BOTTOM;
      translateY.value = nextY;
    })
    .onEnd((event) => {
      if (event.velocityY < -500 || translateY.value < SNAP_BOTTOM - 150) {
        translateY.value = withSpring(SNAP_TOP, { damping: 15 });
      } else {
        translateY.value = withSpring(SNAP_BOTTOM, { damping: 15 });
      }
    });

  // GESTE HORIZONTAL : Swipe Gauche / Droite pour changer de piste
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onEnd((event) => {
      if (event.velocityX < -300) {
        runOnJS(handleTrackChange)('next');
      } else if (event.velocityX > 300) {
        runOnJS(handleTrackChange)('prev');
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Animation de l'opacité du mini lecteur par rapport au plein écran
  const miniPlayerOpacity = useAnimatedStyle(() => {
    const opacity = (translateY.value - SNAP_TOP) / (SNAP_BOTTOM - SNAP_TOP);
    return { opacity: opacity };
  });

  const closePlayer = () => {
    translateY.value = withSpring(SNAP_BOTTOM, { damping: 15 });
  };

  return (
    <GestureHandlerRootView style={styles.overlay} pointerEvents="box-none">
      <GestureDetector gesture={Gesture.Simultaneous(panGesture, swipeGesture)}>
        <Animated.View style={[styles.container, animatedStyle]}>
          
          {/* INTERFACE MINI-LECTEUR */}
          <Animated.View style={[styles.miniPlayerContent, miniPlayerOpacity]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100' }} 
              style={styles.albumArt} 
            />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>Blinding Lights</Text>
              <Text style={styles.trackArtist} numberOfLines={1}>The Weeknd</Text>
            </View>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={{ color: '#fff' }}>⏸</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* INTERFACE PLEIN ÉCRAN HAUT DE GAMME */}
          <FullScreenPlayer onClose={closePlayer} translateY={translateY} snapTop={SNAP_TOP} snapBottom={SNAP_BOTTOM} />

        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  container: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: SCREEN_HEIGHT,
    backgroundColor: SpotifyTheme.colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  miniPlayerContent: {
    height: MIN_PLAYER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SpotifyTheme.spacing.sm,
    backgroundColor: '#242424',
  },
  albumArt: {
    width: 44,
    height: 44,
    borderRadius: 4,
  },
  trackInfo: {
    flex: 1,
    marginLeft: SpotifyTheme.spacing.md,
  },
  trackTitle: {
    color: SpotifyTheme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  trackArtist: {
    color: SpotifyTheme.colors.textMuted,
    fontSize: 12,
  },
  controlButton: {
    padding: SpotifyTheme.spacing.sm,
  },
});
