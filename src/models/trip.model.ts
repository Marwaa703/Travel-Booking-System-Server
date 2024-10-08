import pool from "../db";
import { Trip } from "../types/trip";

// Create a new trip
async function createTrip(trip: Trip): Promise<Trip | null> {
  try {
    const {
      companyId,
      name,
      description,
      price,
      max_reservations,
      date,
      status,
      rate,
    } = trip;
    const result = await pool.query(
      `INSERT INTO trip (company_id, name, description, price, max_reservations, date, status, rate) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [
        companyId,
        name,
        description,
        price,
        max_reservations,
        date,
        status,
        rate,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Failed to create trip:", error);
    return null;
  }
}

// Get all trips
async function getAllTrips(): Promise<Trip[]> {
  try {
    const result = await pool.query("SELECT * FROM trip");
    return result.rows;
  } catch (error) {
    console.error("Failed to retrieve trips:", error);
    return [];
  }
}

// Get a single trip by ID
async function getTripById(tripId: string): Promise<Trip | null> {
  try {
    const result = await pool.query("SELECT * FROM trip WHERE id = $1;", [
      tripId,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Failed to retrieve trip:", error);
    return null;
  }
}

// Update a trip
async function updateTrip(
  tripId: string,
  updates: Partial<Trip>
): Promise<Trip | null> {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(", ");

  try {
    const result = await pool.query(
      `UPDATE trip SET ${setClause} WHERE id = $1 RETURNING *;`,
      [tripId, ...values]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Failed to update trip:", error);
    return null;
  }
}

// Delete a trip
async function deleteTrip(tripId: string): Promise<boolean> {
  try {
    await pool.query("DELETE FROM trip WHERE id = $1;", [tripId]);
    return true;
  } catch (error) {
    console.error("Failed to delete trip:", error);
    return false;
  }
}

// Get all trips by company_id
async function getTripsByCompanyId(companyId: string): Promise<Trip[]> {
  try {
    const result = await pool.query("SELECT * FROM trip WHERE company_id = $1;", [
      companyId,
    ]);
    return result.rows;
  } catch (error) {
    console.error("Failed to retrieve trips for company:", error);
    return [];
  }
}

export { createTrip, getAllTrips, getTripById, updateTrip, deleteTrip, getTripsByCompanyId };
