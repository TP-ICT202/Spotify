import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

interface CanvasPlayerProps {
  videoUrl: string; // URL de la vidéo de 8 secondes
}

export default function CanvasPlayer({ videoUrl }: CanvasPlayerProps): React.JSX.Element {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        // Lecture en boucle seamless (sans coupure)
        repeat={true}
        // Pas de son (c'est juste une vidéo d'ambiance)
        muted={true}
        // Redimensionner pour couvrir tout l'écran
        resizeMode="cover"
        // Démarrer automatiquement
        paused={false}
        // Masquer les contrôles natifs
        controls={false}
        // Callbacks
        onLoad={() => setIsLoaded(true)}
        onError={(error) => console.error('❌ Erreur Canvas vidéo:', error)}
        // Mise en cache automatique
        bufferConfig={{
          minBufferMs: 2500,
          maxBufferMs: 10000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Position absolue pour être en arrière-plan
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Derrière tous les autres éléments
  },
  video: {
    flex: 1,
  },
});