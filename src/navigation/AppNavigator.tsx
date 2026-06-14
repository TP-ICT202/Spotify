import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LibraryScreen from '../screens/LibraryScreen';
import MiniPlayer from '../components/player/MiniPlayer';

const Tab = createBottomTabNavigator();

export function AppNavigator(): React.JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#121212',
            borderTopColor: '#282828',
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarActiveTintColor: '#1DB954',
          tabBarInactiveTintColor: '#B3B3B3',
        }}>

        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Accueil',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>🏠</Text>
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: 'Rechercher',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>🔍</Text>
            ),
          }}
        />

        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            tabBarLabel: 'Bibliothèque',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>📚</Text>
            ),
          }}
        />

      </Tab.Navigator>

      {/* Mini lecteur flottant au-dessus de la barre d'onglets */}
      <MiniPlayer />
    </View>
  );
}