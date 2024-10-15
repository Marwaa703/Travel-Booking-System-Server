import pool from "../db";
import { TripImage } from "../types/trip";

export class TripImages {
  // Create a new TripImage
  async create(image: TripImage): Promise<TripImage | null> {
    try {
      const { image_url, caption, trip_id } = image;
      const result = await pool.query(
        `INSERT INTO trip_images (image_url, caption, trip_id) 
         VALUES ($1, $2, $3) RETURNING *;`,
        [image_url, caption, trip_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to create trip image:", error);
      return null;
    }
  }

  // Get all images for a specific trip
  async getImagesByTripId(tripId: string): Promise<TripImage[]> {
    try {
      const result = await pool.query(
        "SELECT * FROM trip_images WHERE trip_id = $1;",
        [tripId]
      );
      return result.rows;
    } catch (error) {
      console.error("Failed to retrieve trip images:", error);
      return [];
    }
  }

  // Get a single TripImage by ID
  async show(imageId: string): Promise<TripImage | null> {
    try {
      const result = await pool.query(
        "SELECT * FROM trip_images WHERE id = $1;",
        [imageId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to retrieve trip image:", error);
      return null;
    }
  }

  // Update a TripImage
  async update(
    imageId: string,
    updates: Partial<TripImage>
  ): Promise<TripImage | null> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");

    try {
      const result = await pool.query(
        `UPDATE trip_images SET ${setClause} WHERE id = $1 RETURNING *;`,
        [imageId, ...values]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to update trip image:", error);
      return null;
    }
  }

  // Delete a TripImage
  async destroy(imageId: string): Promise<boolean> {
    try {
      await pool.query("DELETE FROM trip_images WHERE id = $1;", [imageId]);
      return true;
    } catch (error) {
      console.error("Failed to delete trip image:", error);
      return false;
    }
  }
}
