import pool from "../db";
import { Trip } from "../types/trip";

// Create a new trip
async function createTrip(trip: Trip): Promise<Trip | null> {
  try {
    const {
      company_id,
      name,
      description,
      price,
      max_reservations,
      date,
      end_date,
      status,
      rate,
    } = trip;
    const result = await pool.query(
      `INSERT INTO trip (company_id, name, description, price, max_reservations, date, end_date, status, rate) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        company_id,
        name,
        description,
        price,
        max_reservations,
        date,
        end_date,
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
// Get all trips with images

async function getAllTripsWithImages(companyId?: string): Promise<Trip[]> {
  try {
    const query = `
        SELECT 
        t.id AS trip_id,
        t.company_id,
        t.name,
        t.description,
        t.price,
        t.max_reservations,
        t.date,
        t.end_date,
        t.status,
        t.rate,
        COALESCE(
            json_agg(
                json_build_object(
                    'image_id', ti.image_id,
                    'image_url', ti.image_url,
                    'caption', ti.caption,
                    'trip_id', ti.trip_id
                )
            ) FILTER (WHERE ti.image_url IS NOT NULL), 
        '[]') AS images
      FROM 
        trip t
      LEFT JOIN 
        trip_images ti ON t.id = ti.trip_id
      ${companyId ? "WHERE t.company_id = $1" : ""}
      GROUP BY 
        t.id;`;
    const params = companyId ? [companyId] : [];
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Failed to retrieve trips with images:", error);
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

// Delete full trip data

async function deleteFullTrip(tripId: string): Promise<boolean> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start a transaction

    // Delete associated images
    await client.query("DELETE FROM trip_images WHERE trip_id = $1;", [tripId]);

    // Delete associated locations
    await client.query("DELETE FROM trip_locations WHERE trip_id = $1;", [
      tripId,
    ]);

    // Delete the trip
    await client.query("DELETE FROM trip WHERE id = $1;", [tripId]);

    await client.query("COMMIT"); // Commit the transaction
    return true;
  } catch (error) {
    await client.query("ROLLBACK"); // Roll back the transaction in case of an error
    console.error("Failed to delete trip:", error);
    return false;
  } finally {
    client.release(); // Release the database client back to the pool
  }
}

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
    const result = await pool.query(
      "SELECT * FROM trip WHERE company_id = $1;",
      [companyId]
    );
    return result.rows;
  } catch (error) {
    console.error("Failed to retrieve trips for company:", error);
    return [];
  }
}

export {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripsByCompanyId,
  getAllTripsWithImages,
  deleteFullTrip,
};
