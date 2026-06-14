import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSearchTracks } from '../api/queries/useTrackQueries';
import { AppEntity, TrackContent } from '../interfaces/entities';

export default function SearchScreen(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: results, isLoading } = useSearchTracks(searchTerm);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher</Text>

      {/* Barre de recherche */}
      <TextInput
        style={styles.searchInput}
        placeholder="Artistes, morceaux, podcasts..."
        placeholderTextColor="#B3B3B3"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Résultats */}
      {isLoading && searchTerm.length > 1 && (
        <ActivityIndicator color="#1DB954" style={{ marginTop: 20 }} />
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: AppEntity }) => {
          const content = item.content as TrackContent;
          return (
            <View style={styles.trackItem}>
              <Text style={styles.trackTitle}>{content.title}</Text>
              <Text style={styles.trackArtist}>{content.artist.name}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#121212',
    marginBottom: 16,
  },
  trackItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  trackTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trackArtist: {
    fontSize: 14,
    color: '#B3B3B3',
    marginTop: 2,
  },
});