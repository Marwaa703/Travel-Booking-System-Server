import pool from '../db';

interface Trip {
  id: number;
  name: string;
  description?: string;
  images?: string;
  max_reservations: number;
  company_id: number | null; // could be null if company deleted 
}

// Create a new trip
async function createTrip(trip: Trip): Promise<Trip | null> {
  try {
    const { name, description, images, max_reservations, company_id } = trip;
    const result = await pool.query(
      `INSERT INTO trip (name, description, images, max_reservations, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [name, description, images, max_reservations, company_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Failed to create trip:', error);
    return null;
  }
}

// Get all trips
async function getAllTrips(): Promise<Trip[]> {
  try {
    const result = await pool.query('SELECT * FROM trip;');
    return result.rows;
  } catch (error) {
    console.error('Failed to retrieve trips:', error);
    return [];
  }
}

// Get a single trip by ID
async function getTripById(tripId: number): Promise<Trip | null> {
  try {
    const result = await pool.query('SELECT * FROM trip WHERE id = $1;', [tripId]);
    return result.rows[0];
  } catch (error) {
    console.error('Failed to retrieve trip:', error);
    return null;
  }
}

// Update a trip
async function updateTrip(tripId: number, updates: Partial<Trip>): Promise<Trip | null> {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

  try {
    const result = await pool.query(
      `UPDATE trip SET ${setClause} WHERE id = $1 RETURNING *;`,
      [tripId, ...values]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Failed to update trip:', error);
    return null;
  }
}

// Delete a trip
async function deleteTrip(tripId: number): Promise<boolean> {
  try {
    await pool.query('DELETE FROM trip WHERE id = $1;', [tripId]);
    return true;
  } catch (error) {
    console.error('Failed to delete trip:', error);
    return false;
  }
}

export { createTrip, getAllTrips, getTripById, updateTrip, deleteTrip };
