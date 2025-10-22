import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

export const storage = {
  // Get all favorite event IDs
  async getFavorites(): Promise<string[]> {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  // Add event to favorites
  async addToFavorites(eventId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(eventId)) {
        favorites.push(eventId);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  },

  // Remove event from favorites
  async removeFromFavorites(eventId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(id => id !== eventId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  },

  // Check if event is favorite
  async isFavorite(eventId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.includes(eventId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }
};
