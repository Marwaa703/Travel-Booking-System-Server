import pool from "../db";
import { CompanyUser } from "../types/company";

export class CompanyUsers {
  // Create a new CompanyUser
  async create(companyUser: CompanyUser): Promise<CompanyUser | null> {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        phone,
        birth_date,
        role,
        gender,
        company_id,
      } = companyUser;
      const result = await pool.query(
        `INSERT INTO company_users (first_name, last_name, email, password, phone, birth_date, role, gender, company_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
        [
          first_name,
          last_name,
          email,
          password,
          phone,
          birth_date,
          role,
          gender,
          company_id,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to create CompanyUser:", error);
      return null;
    }
  }

  // Get all CompanyUsers
  async index(): Promise<CompanyUser[]> {
    try {
      const result = await pool.query("SELECT * FROM company_users;");
      return result.rows;
    } catch (error) {
      console.error("Failed to retrieve CompanyUsers:", error);
      return [];
    }
  }

  async indexCompany(companyId: string): Promise<CompanyUser[]> {
    try {
      const result = await pool.query(
        `SELECT * FROM company_users WHERE company_id = $1;`,
        [companyId]
      );
      return result.rows;
    } catch (error) {
      console.error("Failed to retrieve CompanyUsers:", error);
      return [];
    }
  }
  async indexUserByEmail(email: string): Promise<CompanyUser> {
    try {
      const result = await pool.query(
        `SELECT * FROM company_users WHERE email = $1;`,
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Failed to retrieve User with email: ${email}`, error);
      return {} as never;
    }
  }

  async showCompanyUser(
    companyId: string,
    userId: string
  ): Promise<CompanyUser | null> {
    try {
      const result = await pool.query(
        `SELECT * FROM company_users WHERE company_id = $1 AND id = $2;`,
        [companyId, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to retrieve CompanyUser:", error);
      return null;
    }
  }

  // Get a single CompanyUser by ID
  async show(userId: string): Promise<CompanyUser | null> {
    try {
      const result = await pool.query(
        "SELECT * FROM company_users WHERE id = $1;",
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to retrieve CompanyUser:", error);
      return null;
    }
  }

  // Get a single CompanyUser by email
  async getCompanyUserByEmail(userEmail: string): Promise<CompanyUser | null> {
    try {
      const query = "SELECT * FROM company_users WHERE email = $1";
      const values = [userEmail];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0] as CompanyUser;
    } catch (error) {
      console.error("Error fetching CompanyUser by email:", error);
      throw error;
    }
  }

  // Update a CompanyUser
  async update(
    userId: string,
    updates: Partial<CompanyUser>
  ): Promise<CompanyUser | null> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");

    try {
      const result = await pool.query(
        `UPDATE company_users SET ${setClause} WHERE id = $1 RETURNING *;`,
        [userId, ...values]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to update CompanyUser:", error);
      return null;
    }
  }

  // Delete a CompanyUser
  async destroy(userId: string): Promise<boolean> {
    try {
      await pool.query("DELETE FROM company_users WHERE id = $1;", [userId]);
      return true;
    } catch (error) {
      console.error("Failed to delete CompanyUser:", error);
      return false;
    }
  }
}
