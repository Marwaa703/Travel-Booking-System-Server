import pool from '../db';

interface BookedTrip {
  id: number;
  user_id: number;
  trip_id: number;
}

// Create a new booked trip
async function createBookedTrip(bookedTrip: BookedTrip): Promise<BookedTrip | null> {
  try {
    const { user_id, trip_id } = bookedTrip;
    const result = await pool.query(
      `INSERT INTO booked_trip (user_id, trip_id) VALUES ($1, $2) RETURNING *;`,
      [user_id, trip_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Failed to book the trip:', error);
    return null;
  }
}

// Get all booked trips for a user
async function getAllBookedTripsByUserId(userId: number): Promise<BookedTrip[]> {
  try {
    const result = await pool.query('SELECT * FROM booked_trip WHERE user_id = $1;', [userId]);
    return result.rows;
  } catch (error) {
    console.error('Failed to retrieve booked trips:', error);
    return [];
  }
}

// Get all users who booked a specific trip
async function getAllUsersForTrip(tripId: number): Promise<BookedTrip[]> {
  try {
    const result = await pool.query('SELECT * FROM booked_trip WHERE trip_id = $1;', [tripId]);
    return result.rows;
  } catch (error) {
    console.error('Failed to retrieve users for the trip:', error);
    return [];
  }
}

// Get a specific booked trip by its ID
async function getBookedTripById(id: number): Promise<BookedTrip | null> {
  try {
    const result = await pool.query('SELECT * FROM booked_trip WHERE id = $1;', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Failed to retrieve booked trip:', error);
    return null;
  }
}

// Delete a booked trip by its ID
async function deleteBookedTrip(id: number): Promise<boolean> {
  try {
    await pool.query('DELETE FROM booked_trip WHERE id = $1;', [id]);
    return true;
  } catch (error) {
    console.error('Failed to delete booked trip:', error);
    return false;
  }
}

export { createBookedTrip, getAllBookedTripsByUserId, getAllUsersForTrip, getBookedTripById, deleteBookedTrip };
