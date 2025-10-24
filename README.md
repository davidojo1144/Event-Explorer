# Event Explorer

A React Native TypeScript app for exploring events and managing favorites with persistent storage.

## Features

✅ **Event List Screen**
- Scrollable list of upcoming events
- Event cards with title, date, time, description, and category
- Search functionality to filter events by name, category, or location
- Pull-to-refresh functionality

✅ **Event Details Screen**
- Full event information display
- Add/Remove from favorites toggle
- Responsive layout for both iOS and Android

✅ **Favorites Screen**
- Separate screen showing only favorited events
- Remove events from favorites
- Empty state with helpful messaging

✅ **Persistent Storage**
- AsyncStorage integration for favorites persistence
- Favorites persist between app sessions

✅ **Navigation**
- Stack navigation between screens
- Seamless navigation experience

## Tech Stack

- **React Native CLI** and **React Native Expo** 
- **TypeScript**
- **React Navigation** (Stack Navigator)
- **AsyncStorage** for local storage
- **React Native Safe Area Context**
- **React Native Screens**

## Installation

1. **Install dependencies:**
   ```bash
   cd EventExplorer or EventExplorerExpo
   npm install
   ```

2. **For iOS (macOS only):**
   ```bash
   cd ios && pod install
   ```

3. **Run on Android:**
   ```bash
   npx react-native run-android
   ```

4. **Run on iOS:**
   ```bash
   npx react-native run-ios
   ```

## Project Structure

```
EventExplorer/
├── src/
│   ├── components/          # Reusable components
│   ├── data/
│   │   └── mockData.ts      # Mock event data
│   ├── navigation/
│   │   └── AppNavigator.tsx # Navigation setup
│   ├── screens/
│   │   ├── EventListScreen.tsx    # Main events list
│   │   ├── EventDetailsScreen.tsx # Event details view
│   │   └── FavoritesScreen.tsx    # Favorites management
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   └── utils/
│       └── storage.ts       # AsyncStorage utilities
├── App.tsx                  # Main app component
├── index.js                 # App entry point
├── package.json
├── tsconfig.json
├── babel.config.js
└── metro.config.js
```

## Features Implemented

### Core Requirements
- ✅ Event List Screen with scrollable list
- ✅ Event Details Screen with full information
- ✅ Favorites Screen for managing favorites
- ✅ AsyncStorage for persistent storage
- ✅ React Navigation for screen navigation
- ✅ TypeScript throughout the project
- ✅ Responsive design for iOS/Android

### Bonus Features
- ✅ Search bar to filter events by name, category, or location
- ✅ Pull-to-refresh functionality on event list
- ✅ FlatList optimizations with keyExtractor
- ✅ Clean, modular code structure
- ✅ Comprehensive error handling
- ✅ Loading states and empty states
- ✅ Confirmation dialogs for user actions

## Mock Data

The app includes 8 diverse mock events across different categories:
- Technology (React Native Conference)
- Music (Jazz Night)
- Food (Food Festival)
- Business (Startup Pitch Competition)
- Art (Art Gallery Opening)
- Sports (Marathon)
- Literature (Book Fair)
- Festival (New Year's Eve Celebration)

## Usage

1. **Browse Events**: View all events in the main list
2. **Search Events**: Use the search bar to filter events
3. **View Details**: Tap any event to see full details
4. **Add to Favorites**: Tap the favorite button on event details or event cards
5. **Manage Favorites**: Access favorites from the "Favorites" button in the header
6. **Remove Favorites**: Use the "Remove" button on favorite events

## Development Notes

- The app uses placeholder images from via.placeholder.com
- All favorites are persisted locally using AsyncStorage
- The app handles loading states and errors gracefully
- Search is case-insensitive and searches across title, category, and location
- Pull-to-refresh reloads the event list and syncs favorite status

## Future Enhancements

- Event registration functionality
- Event sharing capabilities
- Map integration for event locations
- Push notifications for upcoming events
- User authentication
- Real API integration
- Event creation and editing
