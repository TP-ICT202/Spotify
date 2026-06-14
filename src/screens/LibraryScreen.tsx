import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LibraryScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ma Bibliothèque</Text>
      <Text style={styles.subtitle}>Playlists, téléchargements et fichiers locaux</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#B3B3B3',
  },
});