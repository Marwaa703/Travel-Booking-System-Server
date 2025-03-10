import pool from "../db";
import { User } from "../types/user";

// Create a new user
async function createUser(user: User): Promise<User | null> {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      gender,
      phone,
      birth_date,
      role = "User",
    } = user;
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, gender, phone, birth_date, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [first_name, last_name, email, password, gender, phone, birth_date, role]
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

//Admin Login
const getAdminByEmail = async (email: string): Promise<User | null> => {
  try {
      const query = "SELECT * FROM users WHERE email = $1 AND role='Admin' ";
      const values = [email];
      const result = await pool.query(query, values);
      return result.rows.length > 0 ? (result.rows[0] as User) : null;
  } catch (error) {
      console.error("Error fetching user by email:", error);
      return null; 
  }
};

//Login
const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? (result.rows[0] as User) : null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
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
  getAdminByEmail,
  updateUser,
  deleteUser,
};
