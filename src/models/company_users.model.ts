import pool from "../db";

export interface CompanyUser {
  id: number;
  name: string;
  email: string;
  password: string;
  gender?: string;
  phone?: string;
  birth_date?: Date;
  role: string;
  company_id?: string; // generated here optionally
}

export class CompanyUsers {
  // Create a new CompanyUser
  async create(CompanyUser: CompanyUser): Promise<CompanyUser | null> {
    try {
      const { name, email, password, gender, phone, birth_date, role } =
        CompanyUser;
      const result = await pool.query(
        `INSERT INTO company_users (name, email, password, gender, phone, birth_date, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
        [name, email, password, gender, phone, birth_date, role]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to create CompanyUser:", error);
      return null;
    }
  }

  // Get all CompaniesUsers
  async index(): Promise<CompanyUser[]> {
    try {
      const result = await pool.query("SELECT * FROM company_users;");
      return result.rows;
    } catch (error) {
      console.error("Failed to retrieve CompanyUsers:", error);
      return [];
    }
  }
  // Get all CompaniesUsers
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
  async showCompanyUser(
    companyId: string,
    userId: string
  ): Promise<CompanyUser[]> {
    try {
      const result = await pool.query(
        `SELECT * FROM company_users WHERE company_id = $1 AND id = $2;`,
        [companyId, userId]
      );
      return result.rows;
    } catch (error) {
      console.error("Failed to retrieve CompanyUsers:", error);
      return [];
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
