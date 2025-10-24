import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Event } from '../types/Event';
import { mockEvents } from '../data/events';

interface EventListScreenProps {
  navigation: any;
}

const EventListScreen: React.FC<EventListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.dateTime}>{item.date.toDateString()} at {item.time}</Text>
      <Text style={styles.description}>{item.description.substring(0, 100)}...</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search events..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity
        style={styles.favoritesButton}
        onPress={() => navigation.navigate('Favorites')}
      >
        <Text style={styles.favoritesButtonText}>View Favorites</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
    backgroundColor: '#fff',
  },
  favoritesButton: {
    backgroundColor: '#007bff',
    padding: 13,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  favoritesButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EventListScreen;
