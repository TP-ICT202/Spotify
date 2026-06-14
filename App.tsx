import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import 'react-native-url-polyfill/auto';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App(): React.JSX.Element {
  return (
    // GestureHandlerRootView → active les gestes (swipe, etc.)
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* QueryClientProvider → cache des requêtes Supabase */}
      <QueryClientProvider client={queryClient}>
        {/* NavigationContainer → conteneur principal de navigation */}
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}