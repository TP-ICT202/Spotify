import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const FILTERS = ['Playlists', 'Téléchargements', 'Fichiers locaux'];

const MOCK_PLAYLISTS = [
  { id: '1', title: 'Liked Songs', count: 234 },
  { id: '2', title: 'Mon Mix du soir', count: 12 },
  { id: '3', title: 'Workout 🔥', count: 18 },
  { id: '4', title: 'Chill Vibes', count: 9 },
];

export default function LibraryScreen() {
  const [activeFilter, setActiveFilter] = useState('Playlists');

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bibliothèque</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Filtres */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Liste des playlists */}
      <View style={styles.list}>
        {MOCK_PLAYLISTS.map((playlist) => (
          <TouchableOpacity key={playlist.id} style={styles.playlistItem}>
            <View style={styles.playlistCover} />
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistTitle}>{playlist.title}</Text>
              <Text style={styles.playlistMeta}>
                Playlist • {playlist.count} morceaux
              </Text>
            </View>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#282828',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#1DB954',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#121212',
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 16,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  playlistCover: {
    width: 56,
    height: 56,
    backgroundColor: '#282828',
    borderRadius: 4,
  },
  playlistInfo: {
    marginLeft: 12,
  },
  playlistTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  playlistMeta: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
});