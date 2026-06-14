import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useFetchTracks } from '../api/queries/useTrackQueries';
import { AppEntity, TrackContent } from '../interfaces/entities';
import { usePlayerStore } from '../store/playerStore';

export default function HomeScreen(): React.JSX.Element {
  const { data: tracks, isLoading, isError } = useFetchTracks();
  const { playTrack } = usePlayerStore();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erreur de chargement</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonne écoute 👋</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>V</Text>
        </View>
      </View>

      {/* Section titre */}
      <Text style={styles.sectionTitle}>Morceaux populaires</Text>

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: AppEntity }) => {
          const content = item.content as TrackContent;
          return (
            <TouchableOpacity
              style={styles.trackItem}
              activeOpacity={0.7}
              onPress={() => playTrack({ id: item.id, content })}>

              {/* Pochette */}
              <View style={styles.coverContainer}>
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
              </View>

              {/* Infos */}
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {content.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {content.artist.name} • {content.album.title}
                </Text>
              </View>

              {/* Bouton options */}
              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreButtonText}>•••</Text>
              </TouchableOpacity>

            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  centered: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  coverContainer: {
    marginRight: 12,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 4,
  },
  coverPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  coverPlaceholderText: {
    fontSize: 24,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 13,
    color: '#B3B3B3',
  },
  moreButton: {
    paddingHorizontal: 8,
  },
  moreButtonText: {
    color: '#B3B3B3',
    fontSize: 16,
    letterSpacing: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#282828',
    marginLeft: 68,
  },
});