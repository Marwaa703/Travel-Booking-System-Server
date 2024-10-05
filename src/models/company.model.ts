import pool from "../db";
import dotenv from "dotenv";
import { Company } from "../types/company";

dotenv.config();

export class Companies {
  // Create a new company
  async create(company: Company): Promise<Company | null> {
    try {
      const { name, address, logo, wallet, approved } = company;
      const result = await pool.query(
        `INSERT INTO companies (name, address, logo, wallet, approved) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [
          name,
          address,
          logo,
          wallet,
          approved ?? false, // Set default value if not provided
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to create company:", error);
      return null;
    }
  }

  // Get all companies
  async index(): Promise<Company[]> {
    try {
      const result = await pool.query("SELECT * FROM companies;");
      return result.rows;
    } catch (error) {
      console.error("Failed to retrieve companies:", error);
      return [];
    }
  }

  // Get a single company by ID
  async show(id: string): Promise<Company | null> {
    // Changed to string
    try {
      const result = await pool.query(
        "SELECT * FROM companies WHERE id = $1;",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to retrieve company:", error);
      return null;
    }
  }

  async getNameEmail(name: string): Promise<Company | null> {
    try {
      const query = "SELECT * FROM companies WHERE name = $1";
      const values = [name];

      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0] as Company;
    } catch (error) {
      console.error("Error fetching company by name:", error);
      throw error;
    }
  }

  // Update a company
  async update(id: string, updates: Partial<Company>): Promise<Company | null> {
    // Changed to string
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");

    try {
      const result = await pool.query(
        `UPDATE companies SET ${setClause} WHERE id = $1 RETURNING *;`,
        [id, ...values]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to update company:", error);
      return null;
    }
  }

  // Delete a company
  async destroy(id: string): Promise<boolean> {
    // Changed to string
    try {
      await pool.query("DELETE FROM companies WHERE id = $1;", [id]);
      return true;
    } catch (error) {
      console.error("Failed to delete company:", error);
      return false;
    }
  }
}
