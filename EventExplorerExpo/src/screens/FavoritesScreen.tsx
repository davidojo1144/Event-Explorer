import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '../types/Event';
import { mockEvents } from '../data/events';

interface FavoritesScreenProps {
  navigation: any;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const [favorites, setFavorites] = useState<Event[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoriteIds = await AsyncStorage.getItem('favorites');
        if (favoriteIds) {
          const ids = JSON.parse(favoriteIds);
          const favoriteEvents = mockEvents.filter(event => ids.includes(event.id));
          setFavorites(favoriteEvents);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  const removeFromFavorites = async (eventId: string) => {
    try {
      const favoriteIds = await AsyncStorage.getItem('favorites');
      if (favoriteIds) {
        let ids: string[] = JSON.parse(favoriteIds);
        ids = ids.filter(id => id !== eventId);
        await AsyncStorage.setItem('favorites', JSON.stringify(ids));
        setFavorites(favorites.filter(event => event.id !== eventId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const renderFavorite = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { event: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.dateTime}>{item.date.toDateString()} at {item.time}</Text>
      <Text style={styles.description}>{item.description.substring(0, 100)}...</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromFavorites(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.noFavorites}>No favorite events yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavorite}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  list: {
    padding: 10,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noFavorites: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});

export default FavoritesScreen;
