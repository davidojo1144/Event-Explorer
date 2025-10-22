import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Event } from '../types';
import { storage } from '../utils/storage';

type RootStackParamList = {
  EventList: undefined;
  EventDetails: { event: Event };
  Favorites: undefined;
};

type EventDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EventDetails'>;
type EventDetailsScreenRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;

interface Props {
  navigation: EventDetailsScreenNavigationProp;
  route: EventDetailsScreenRouteProp;
}

const EventDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { event } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    const favorite = await storage.isFavorite(event.id);
    setIsFavorite(favorite);
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await storage.removeFromFavorites(event.id);
        setIsFavorite(false);
        Alert.alert('Removed from Favorites', `${event.title} has been removed from your favorites.`);
      } else {
        await storage.addToFavorites(event.id);
        setIsFavorite(true);
        Alert.alert('Added to Favorites', `${event.title} has been added to your favorites.`);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />

        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
              onPress={toggleFavorite}
            >
              <Text style={[styles.favoriteButtonText, isFavorite && styles.favoriteButtonTextActive]}>
                {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>{formatDate(event.date)}</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Time</Text>
              <Text style={styles.metaValue}>{formatTime(event.time)}</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Category</Text>
              <Text style={styles.metaValue}>{event.category}</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Location</Text>
              <Text style={styles.metaValue}>{event.location}</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => Alert.alert('Feature Coming Soon', 'Event registration will be available soon!')}
            >
              <Text style={styles.primaryButtonText}>Register for Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => Alert.alert('Feature Coming Soon', 'Share functionality will be available soon!')}
            >
              <Text style={styles.secondaryButtonText}>Share Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eventImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  favoriteButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  favoriteButtonActive: {
    backgroundColor: '#FFE4B5',
  },
  favoriteButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  favoriteButtonTextActive: {
    color: '#FF8C00',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    lineHeight: 34,
  },
  metaContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  metaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  metaValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actionContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventDetailsScreen;
