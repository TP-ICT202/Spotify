import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-url-polyfill/auto';

// Création du client React Query
// C'est lui qui gère tout le cache des requêtes Supabase
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Combien de fois retry une requête échouée ?
      retry: 2,
      // Les données restent "fraîches" 5 minutes avant d'être rechargées
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App(): React.JSX.Element {
  return (
    // QueryClientProvider rend le cache accessible à tous les composants enfants
    <QueryClientProvider client={queryClient}>
    </QueryClientProvider>
  );
}