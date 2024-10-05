import pool from "../db";
import { CompanyPaper } from "../types/company";

export class CompanyPapers {
  // Create a new company paper
  async create(companyPaper: CompanyPaper): Promise<CompanyPaper | null> {
    try {
      const { companyId, imageUrl, title } = companyPaper;
      const result = await pool.query(
        `INSERT INTO company_papers (company_id, image_url, title) 
         VALUES ($1, $2, $3) RETURNING *;`,
        [companyId, imageUrl, title]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to create company paper:", error);
      return null;
    }
  }

  // Get all company papers
  async index(): Promise<CompanyPaper[]> {
    try {
      const result = await pool.query("SELECT * FROM company_papers;");
      return result.rows;
    } catch (error) {
      console.error("Failed to retrieve company papers:", error);
      return [];
    }
  }

  // Get a single company paper by ID
  async show(paperId: string): Promise<CompanyPaper | null> {
    try {
      const result = await pool.query(
        "SELECT * FROM company_papers WHERE paper_id = $1;",
        [paperId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to retrieve company paper:", error);
      return null;
    }
  }

  // Update a company paper
  async update(
    paperId: string,
    updates: Partial<CompanyPaper>
  ): Promise<CompanyPaper | null> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");

    try {
      const result = await pool.query(
        `UPDATE company_papers SET ${setClause} WHERE paper_id = $1 RETURNING *;`,
        [paperId, ...values]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Failed to update company paper:", error);
      return null;
    }
  }

  // Delete a company paper
  async destroy(paperId: string): Promise<boolean> {
    try {
      await pool.query("DELETE FROM company_papers WHERE paper_id = $1;", [
        paperId,
      ]);
      return true;
    } catch (error) {
      console.error("Failed to delete company paper:", error);
      return false;
    }
  }
}
