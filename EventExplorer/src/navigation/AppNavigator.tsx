import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Event } from '../types';

// Import screens
import EventListScreen from '../screens/EventListScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

export type RootStackParamList = {
  EventList: undefined;
  EventDetails: { event: Event };
  Favorites: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="EventList"
        screenOptions={{
          headerShown: false, // We're handling headers in individual screens
        }}
      >
        <Stack.Screen name="EventList" component={EventListScreen} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
