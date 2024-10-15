import pool from "../db";
import { BookedTrip } from "../types/trip";

class BookedTrips {
  // Create a new booked trip
  async create(bookedTrip: BookedTrip): Promise<BookedTrip | null> {
    try {
      const { user_id, trip_id, transactionHash } = bookedTrip;
      const result = await pool.query(
        `INSERT INTO booked_trips (user_id, trip_id, transactionHash) VALUES ($1, $2, $3) RETURNING *;`,
        [user_id, trip_id, transactionHash]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to book the trip:", error);
      return null;
    }
  }

  // Get all booked trips for a user
  async getAllByUserId(userId: string): Promise<BookedTrip[]> {
    try {
      const result = await pool.query(
        "SELECT * FROM booked_trips WHERE user_id = $1;",
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error("Failed to retrieve booked trips:", error);
      return [];
    }
  }

  // Get all users who booked a specific trip
  async getAllUsersForTrip(tripId: string): Promise<BookedTrip[]> {
    try {
      const result = await pool.query(
        "SELECT * FROM booked_trips WHERE trip_id = $1;",
        [tripId]
      );
      return result.rows;
    } catch (error) {
      console.error("Failed to retrieve users for the trip:", error);
      return [];
    }
  }

  // Get a specific booked trip by its composite ID
  async getById(id: string): Promise<BookedTrip | null> {
    try {
      const result = await pool.query(
        "SELECT * FROM booked_trips WHERE id = $1;",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to retrieve booked trip:", error);
      return null;
    }
  }

  // Delete a booked trip by its composite ID
  async delete(id: string): Promise<boolean> {
    try {
      await pool.query("DELETE FROM booked_trips WHERE id = $1;", [id]);
      return true;
    } catch (error) {
      console.error("Failed to delete booked trip:", error);
      return false;
    }
  }
}

export default new BookedTrips();
