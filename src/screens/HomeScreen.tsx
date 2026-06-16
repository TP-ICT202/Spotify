import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonsoir 👋</Text>
      </View>

      {/* Section Raccourcis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Écoutes récentes</Text>
        <View style={styles.grid}>
          {['Liked Songs', 'Daily Mix 1', 'Top Hits', 'Chill Vibes'].map((item) => (
            <View key={item} style={styles.shortcutCard}>
              <View style={styles.shortcutImage} />
              <Text style={styles.shortcutText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Section Recommandations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommandé pour toi</Text>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.trackCard}>
            <View style={styles.trackImage} />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>Morceau {i}</Text>
              <Text style={styles.trackArtist}>Artiste {i}</Text>
            </View>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    borderRadius: 4,
    width: '48%',
    overflow: 'hidden',
  },
  shortcutImage: {
    width: 48,
    height: 48,
    backgroundColor: '#1DB954',
  },
  shortcutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    flex: 1,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackImage: {
    width: 56,
    height: 56,
    backgroundColor: '#282828',
    borderRadius: 4,
  },
  trackInfo: {
    marginLeft: 12,
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  trackArtist: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
});