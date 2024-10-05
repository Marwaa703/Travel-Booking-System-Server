import pool from "../db";
import { User } from "../types/user";

// Create a new user
async function createUser(user: User): Promise<User | null> {
  try {
    const { firstName, lastName, email, password, gender, phone, birthDate } =
      user;
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, gender, phone, birth_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [firstName, lastName, email, password, gender, phone, birthDate]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Failed to create user:", error);
    return null;
  }
}

// Get all users
async function getAllUsers(): Promise<User[]> {
  try {
    const result = await pool.query("SELECT * FROM users;");
    return result.rows;
  } catch (error) {
    console.error("Failed to retrieve users:", error);
    return [];
  }
}

// Get a single user by ID
async function getUserById(userId: string): Promise<User | null> {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1;", [
      userId,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    return null;
  }
}

const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0] as User;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

// Update a user
async function updateUser(
  userId: string,
  updates: Partial<User>
): Promise<User | null> {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(", ");

  try {
    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *;`,
      [userId, ...values]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Failed to update user:", error);
    return null;
  }
}

// Delete a user
async function deleteUser(userId: string): Promise<boolean> {
  try {
    await pool.query("DELETE FROM users WHERE id = $1;", [userId]);
    return true;
  } catch (error) {
    console.error("Failed to delete user:", error);
    return false;
  }
}

export {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
