import pool from "../db";
import { TripLocation } from "../types/trip";

export class TripLocations {
  // Create a new TripLocation
  async create(location: TripLocation): Promise<TripLocation | string> {
    try {
      const { trip_id, location_order, lat, lon, image_url, name } = location;
      console.log({ location });
      const result = await pool.query(
        `INSERT INTO trip_locations (trip_id, location_order, lat, lon, image_url, name) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [trip_id, location_order, lat, lon, image_url, name.slice(0, 80)]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Failed to create trip location:", error);
      return `Failed to create trip location:, ${error}`;
    }
  }

  // Get all locations for a specific trip
  async getLocationsByTripId(tripId: string): Promise<TripLocation[]> {
    try {
      const result = await pool.query(
        "SELECT * FROM trip_locations WHERE trip_id = $1;",
        [tripId]
      );
      return result.rows;
    } catch (error) {
      console.error("Failed to retrieve trip locations:", error);
      return [];
    }
  }

  // Get a single TripLocation by ID
  async show(locationId: string): Promise<TripLocation | null> {
    try {
      const result = await pool.query(
        "SELECT * FROM trip_locations WHERE id = $1;",
        [locationId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to retrieve trip location:", error);
      return null;
    }
  }

  // Update a TripLocation
  async update(
    locationId: string,
    updates: Partial<TripLocation>
  ): Promise<TripLocation | null> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");

    try {
      const result = await pool.query(
        `UPDATE trip_locations SET ${setClause} WHERE id = $1 RETURNING *;`,
        [locationId, ...values]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to update trip location:", error);
      return null;
    }
  }

  // Delete a TripLocation
  async destroy(locationId: string): Promise<boolean> {
    try {
      await pool.query("DELETE FROM trip_locations WHERE id = $1;", [
        locationId,
      ]);
      return true;
    } catch (error) {
      console.error("Failed to delete trip location:", error);
      return false;
    }
  }

  // Search for TripLocations by name
  async searchByName(name: string): Promise<TripLocation[]> {
    try {
      const result = await pool.query(
        "SELECT * FROM trip_locations WHERE name ILIKE $1;",
        [`%${name}%`]
      );
      return result.rows;
    } catch (error) {
      console.error("Failed to search trip locations:", error);
      return [];
    }
  }

}

