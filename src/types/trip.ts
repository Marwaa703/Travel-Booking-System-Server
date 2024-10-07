export interface Trip {
  id?: string;
  companyId?: string;
  name: string;
  description: string;
  price: number;
  max_reservations: number;
  date: Date;
  status?: TripStatus;
  rate?: number | null;
}

export interface TripLocation {
  tripId?: string;
  location_order: number;
  lat: number;
  lon: number;
  imageUrl: string;
  name: string;
}

export interface TripImage {
  imageUrl: string;
  caption: string;
  tripId: string;
}

export interface TripInstruction {
  id: number;
  trip_id: number;
  instruction: string;
  display_time: Date;
}
export interface BookedTrip {
  id: string; // Composite ID
  userId: string;
  tripId: string;
  transactionHash: string;
}

export type TripStatus = "paused" | "active" | "complected" | "canceled";
