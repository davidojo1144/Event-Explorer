import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '../types/Event';
import { mockEvents } from '../data/events';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.dateTime}>
        <Ionicons name="calendar-outline" size={16} color="#666" />
        <Text style={styles.dateTimeText}>{item.date.toDateString()} at {item.time}</Text>
      </View>
      <Text style={styles.description}>{item.description.substring(0, 100)}...</Text>
      <View style={styles.location}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.locationText}>{item.location}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromFavorites(item.id)}
      >
        <Ionicons name="heart-dislike" size={16} color="#fff" />
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>
      {favorites.length === 0 ? (
        <View style={styles.noFavoritesContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.noFavorites}>No favorite events yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavorite}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  list: {
    padding: 10,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  noFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFavorites: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default FavoritesScreen;
