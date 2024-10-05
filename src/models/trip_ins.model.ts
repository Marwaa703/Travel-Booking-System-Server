import pool from "../db";
import { TripInstruction } from "../types/trip";

// Create a new trip instruction
async function createTripInstruction(
  tripInstruction: TripInstruction
): Promise<TripInstruction | null> {
  try {
    const { trip_id, instruction, display_time } = tripInstruction;
    const result = await pool.query(
      `INSERT INTO trip_ins (trip_id, instruction, display_time) VALUES ($1, $2, $3) RETURNING *;`,
      [trip_id, instruction, display_time]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Failed to create trip instruction:", error);
    return null;
  }
}

// Get all instructions for a trip
async function getAllInstructionsByTripId(
  tripId: number
): Promise<TripInstruction[]> {
  try {
    const result = await pool.query(
      "SELECT * FROM trip_ins WHERE trip_id = $1;",
      [tripId]
    );
    return result.rows;
  } catch (error) {
    console.error("Failed to retrieve instructions:", error);
    return [];
  }
}

// Get a single trip instruction by ID
async function getTripInstructionById(
  id: number
): Promise<TripInstruction | null> {
  try {
    const result = await pool.query("SELECT * FROM trip_ins WHERE id = $1;", [
      id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Failed to retrieve trip instruction:", error);
    return null;
  }
}

// Update a trip instruction
async function updateTripInstruction(
  id: number,
  updates: Partial<TripInstruction>
): Promise<TripInstruction | null> {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(", ");

  try {
    const result = await pool.query(
      `UPDATE trip_ins SET ${setClause} WHERE id = $1 RETURNING *;`,
      [id, ...values]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Failed to update trip instruction:", error);
    return null;
  }
}

// Delete a trip instruction
async function deleteTripInstruction(id: number): Promise<boolean> {
  try {
    await pool.query("DELETE FROM trip_ins WHERE id = $1;", [id]);
    return true;
  } catch (error) {
    console.error("Failed to delete trip instruction:", error);
    return false;
  }
}

export {
  createTripInstruction,
  getAllInstructionsByTripId,
  getTripInstructionById,
  updateTripInstruction,
  deleteTripInstruction,
};
