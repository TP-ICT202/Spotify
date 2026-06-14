import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Ce hook écoute les liens profonds (deep links)
// Ex: spotifyclone://track/123 → ouvre directement le morceau 123
export function useDeepLinking(): void {
  const navigation = useNavigation<any>();

  useEffect(() => {
    // Gérer un lien profond
    const handleDeepLink = (url: string) => {
      console.log('🔗 Deep link reçu:', url);

      // Parser l'URL : spotifyclone://track/123
      const route = url.replace('spotifyclone://', '');
      const [type, id] = route.split('/');

      if (type === 'track' && id) {
        // Naviguer vers le morceau
        navigation.navigate('Home', { trackId: id });
        console.log(`🎵 Navigation vers le morceau : ${id}`);
      } else if (type === 'playlist' && id) {
        // Naviguer vers la playlist
        navigation.navigate('Library', { playlistId: id });
        console.log(`📋 Navigation vers la playlist : ${id}`);
      }
    };

    // Écouter les liens quand l'app est déjà ouverte
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Vérifier si l'app a été ouverte via un lien
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Nettoyage quand le composant est démonté
    return () => {
      subscription.remove();
    };
  }, [navigation]);
}