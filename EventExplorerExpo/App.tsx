import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EventListScreen from './src/screens/EventListScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="EventList">
        <Stack.Screen name="EventList" component={EventListScreen} options={{ title: 'Events', headerShown: false }} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'Event Details', headerShown: false }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
