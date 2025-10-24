import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '../types/Event';
import { mockEvents } from '../data/events';
import { SafeAreaView } from 'react-native-safe-area-context';

interface EventDetailsScreenProps {
  route: any;
  navigation: any;
}

const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ route, navigation }) => {
  const { eventId } = route.params as { eventId: string };
  const event = mockEvents.find((e: Event) => e.id === eventId);

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Event not found</Text>
      </View>
    );
  }

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
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.dateTime}>
            <Ionicons name="calendar-outline" size={20} color="#007bff" />
            <Text style={styles.dateTimeText}>{event.date.toDateString()} at {event.time}</Text>
          </View>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={20} color="#007bff" />
            <Text style={styles.locationText}>{event.location}</Text>
          </View>
          <Text style={styles.description}>{event.description}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color="#fff" />
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    margin: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateTimeText: {
    fontSize: 18,
    color: '#666',
    marginLeft: 10,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 18,
    color: '#666',
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  favoriteButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default EventDetailsScreen;
