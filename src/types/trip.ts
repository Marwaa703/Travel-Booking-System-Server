export interface Trip {
  id?: string;
  company_id?: string;
  name: string;
  description: string;
  price: number;
  max_reservations: number;
  date: Date;
  status?: TripStatus;
  rate?: number | null;
}

export interface TripLocation {
  trip_id?: string;
  location_order: number;
  lat: number;
  lon: number;
  image_url: string;
  name: string;
}

export interface TripImage {
  image_url: string;
  caption: string;
  trip_id: string;
}

export interface TripInstruction {
  id: number;
  trip_id: number;
  instruction: string;
  display_time: Date;
}
export interface BookedTrip {
  // id: string; // Composite ID
  user_id: string;
  trip_id: string;
  transactionHash: string;
}

export type TripStatus = "paused" | "active" | "complected" | "canceled";
