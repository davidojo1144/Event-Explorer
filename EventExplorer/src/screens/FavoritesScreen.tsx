import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
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

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

interface Props {
  navigation: FavoritesScreenNavigationProp;
}

const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();

    // Set up listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favoriteIds = await storage.getFavorites();
      const favorites = mockEvents.filter(event => favoriteIds.includes(event.id));
      setFavoriteEvents(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (eventId: string, eventTitle: string) => {
    Alert.alert(
      'Remove from Favorites',
      `Are you sure you want to remove "${eventTitle}" from your favorites?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.removeFromFavorites(eventId);
              await loadFavorites(); // Reload the list
              Alert.alert('Removed', `${eventTitle} has been removed from your favorites.`);
            } catch (error) {
              console.error('Error removing from favorites:', error);
              Alert.alert('Error', 'Failed to remove from favorites. Please try again.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderFavoriteCard = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { event: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromFavorites(item.id, item.title)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>⭐</Text>
      <Text style={styles.emptyStateTitle}>No Favorite Events</Text>
      <Text style={styles.emptyStateSubtitle}>
        Start exploring events and tap the heart icon to add them to your favorites!
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('EventList')}
      >
        <Text style={styles.exploreButtonText}>Explore Events</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={styles.placeholder} />
      </View>

      {favoriteEvents.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favoriteEvents}
          renderItem={renderFavoriteCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesScreen;
