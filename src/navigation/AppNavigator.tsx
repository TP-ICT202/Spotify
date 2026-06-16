import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LibraryScreen from '../screens/LibraryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── ICÔNES SIMPLES EN TEXTE (on remplacera par des vraies icônes plus tard) ───
const HomeIcon = ({ color }: { color: string }) => (
  <React.Fragment>
  </React.Fragment>
);

// ─── NAVIGATION PAR ONGLETS ───────────────────────────────────────
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: '#282828',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#1DB954',
        tabBarInactiveTintColor: '#888888',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: 'Recherche' }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{ tabBarLabel: 'Bibliothèque' }}
      />
    </Tab.Navigator>
  );
}

// ─── NAVIGATION GLOBALE ───────────────────────────────────────────
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}