export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  category: string;
  imageUrl?: string;
}

export interface FavoriteEvent extends Event {
  isFavorite: boolean;
}
