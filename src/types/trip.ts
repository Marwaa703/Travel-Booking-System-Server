export interface TripDetails {
  name: string;
  description: string;
  price: number;
  max_reservations: number;
  id?: string;
  date: Date;
  status?: TripStatus;
  rate?: number | null;
  isFavorite?: boolean; // New
  // Add other trip details fields as needed
}

export interface Location {
  tripId?: string;
  order: number;
  lat: number;
  lon: number;
  imageUrl: string;
  name: string;
}

export interface TripImage {
  imageUrl: string;
  caption: string;
}

export interface TripFormData {
  tripDetails: TripDetails;
  locations: Location[];
  images: TripImage[];
}

export interface Trip {
  tripDetailes: TripDetails;
  images: TripImage[]; // Array of image URLs
  locations: Location[];
}

export type TripStatus = "paused" | "active" | "compeleted" | "canceled";
