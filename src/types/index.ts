export interface Listing {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  lat: number;
  lng: number;
  hostName?: string;
  hostAvatar?: string;
  rating?: number;
  distance?: number;
  images?: string[];
}

export interface Booking {
  id: number;
  listingId: number;
  listing: Listing;
  bookedAt: string;
}

export interface SearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

export type ViewType = 'browse' | 'dashboard' | 'host';
