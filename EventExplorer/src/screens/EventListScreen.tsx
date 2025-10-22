import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Event } from '../types';
import { mockEvents } from '../data/mockData';
import { storage } from '../utils/storage';

type RootStackParamList = {
  EventList: undefined;
  EventDetails: { event: Event };
  Favorites: undefined;
};

type EventListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EventList'>;

interface Props {
  navigation: EventListScreenNavigationProp;
}

const EventListScreen: React.FC<Props> = ({ navigation }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery]);

  const loadEvents = async () => {
    setRefreshing(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data and check favorites
      const favoriteIds = await storage.getFavorites();
      const eventsWithFavorites = mockEvents.map(event => ({
        ...event,
        isFavorite: favoriteIds.includes(event.id)
      }));
      setEvents(eventsWithFavorites);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filterEvents = () => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderEventCard = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { event: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.eventDate}>
          {formatDate(item.date)} at {item.time}
        </Text>
        <Text style={styles.eventCategory}>{item.category}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.eventLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Event Explorer</Text>
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Text style={styles.favoritesButtonText}>Favorites</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadEvents} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  favoritesButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  favoritesButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventCategory: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  eventLocation: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default EventListScreen;
