import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LyricLine } from '../../interfaces/entities';

interface LyricsKaraokeProps {
  lyrics: LyricLine[];        // Tableau de lignes avec timestamps
  currentPositionMs: number;  // Position actuelle en millisecondes
}

export default function LyricsKaraoke({
  lyrics,
  currentPositionMs,
}: LyricsKaraokeProps): React.JSX.Element {
  const scrollViewRef = useRef<ScrollView>(null);

  // Trouver la ligne active en comparant la position actuelle
  // avec les timestamps des paroles
  const activeIndex = lyrics.reduce((lastActive, line, index) => {
    if (currentPositionMs >= line.time_ms) {
      return index; // Cette ligne est passée → elle est potentiellement active
    }
    return lastActive;
  }, 0);

  // Scroller automatiquement vers la ligne active
  useEffect(() => {
    if (scrollViewRef.current && activeIndex > 0) {
      scrollViewRef.current.scrollTo({
        // Chaque ligne fait environ 60px de hauteur
        // On scroll pour centrer la ligne active
        y: Math.max(0, (activeIndex - 2) * 60),
        animated: true,
      });
    }
  }, [activeIndex]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}>

      {lyrics.map((line, index) => {
        const isActive = index === activeIndex;
        const isPast = index < activeIndex;

        return (
          <View key={index} style={styles.lineContainer}>
            <Text
              style={[
                styles.lyricLine,
                isActive && styles.activeLine,  // Ligne en cours → grande et blanche
                isPast && styles.pastLine,       // Ligne passée → grise
              ]}>
              {line.text}
            </Text>
          </View>
        );
      })}

      {/* Espace en bas pour permettre de scroller jusqu'à la dernière ligne */}
      <View style={{ height: 200 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  lineContainer: {
    minHeight: 60,
    justifyContent: 'center',
  },
  lyricLine: {
    fontSize: 20,
    fontWeight: '700',
    color: '#404040',      // Gris foncé par défaut
    lineHeight: 30,
  },
  activeLine: {
    fontSize: 26,          // Plus grande
    color: '#FFFFFF',      // Blanche = en cours
  },
  pastLine: {
    color: '#686868',      // Gris moyen = déjà passée
  },
});