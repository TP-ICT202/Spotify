import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const GENRES = [
  { label: 'Hip-Hop', color: '#E8115B' },
  { label: 'Pop', color: '#1DB954' },
  { label: 'R&B', color: '#E91429' },
  { label: 'Rock', color: '#BC5900' },
  { label: 'Jazz', color: '#503750' },
  { label: 'Afrobeat', color: '#477D95' },
  { label: 'Electronic', color: '#8D67AB' },
  { label: 'Classique', color: '#205B86' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Rechercher</Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Artistes, morceaux ou podcasts"
          placeholderTextColor="#888888"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Genres */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parcourir les catégories</Text>
        <View style={styles.grid}>
          {GENRES.map((genre) => (
            <TouchableOpacity
              key={genre.label}
              style={[styles.genreCard, { backgroundColor: genre.color }]}
            >
              <Text style={styles.genreLabel}>{genre.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#121212',
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreCard: {
    width: '48%',
    height: 96,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'flex-end',
  },
  genreLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});