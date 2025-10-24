import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '../types/Event';

interface EventDetailsScreenProps {
  route: any;
  navigation: any;
}

const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ route, navigation }) => {
  const { event } = route.params as { event: Event };
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        if (favorites) {
          const favoriteIds = JSON.parse(favorites);
          setIsFavorite(favoriteIds.includes(event.id));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavoriteStatus();
  }, [event.id]);

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favoriteIds: string[] = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favoriteIds = favoriteIds.filter(id => id !== event.id);
        setIsFavorite(false);
      } else {
        favoriteIds.push(event.id);
        setIsFavorite(true);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.dateTime}>{event.date} at {event.time}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.location}>Location: {event.location}</Text>
      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <Text style={styles.favoriteButtonText}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    marginBottom: 20,
  },
  favoriteButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EventDetailsScreen;
