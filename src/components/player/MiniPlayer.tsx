import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

interface MiniPlayerProps {
  title?: string;
  artist?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPress?: () => void;
}

export default function MiniPlayer({
  title = 'Aucun morceau',
  artist = '',
  isPlaying = false,
  onPlayPause,
  onNext,
  onPress,
}: MiniPlayerProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      
      {/* Barre de progression */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <View style={styles.content}>
        
        {/* Pochette */}
        <View style={styles.cover} />

        {/* Infos du morceau */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
        </View>

        {/* Boutons de contrôle */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={onPlayPause} style={styles.controlBtn}>
            <Text style={styles.controlIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNext} style={styles.controlBtn}>
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // juste au-dessus de la barre d'onglets
    left: 8,
    right: 8,
    backgroundColor: '#282828',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#404040',
    width: '100%',
  },
  progressFill: {
    height: 2,
    backgroundColor: '#1DB954',
    width: '35%', // sera dynamique plus tard
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cover: {
    width: 40,
    height: 40,
    backgroundColor: '#404040',
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  artist: {
    color: '#888888',
    fontSize: 11,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlBtn: {
    padding: 8,
  },
  controlIcon: {
    fontSize: 20,
  },
});