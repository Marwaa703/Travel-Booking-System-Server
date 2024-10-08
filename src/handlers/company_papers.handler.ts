import { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { authorization } from "../middlewares/authorization";
import { CompanyPapers } from "../models/company_papers.model";
import { CompanyPaper } from "../types/company";

dotenv.config();

const store = new CompanyPapers();

// Get all company papers
const getAllCompanyPapers = async (_req: Request, res: Response) => {
  try {
    const companyPapers = await store.index();
    res.status(200).json(companyPapers);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve company papers" });
  }
};

// Get a single company paper by paper ID
const getCompanyPaper = async (req: Request, res: Response) => {
  try {
    const companyPaper = await store.show(req.params.paperId);
    if (!companyPaper) {
      res.status(404).json({ error: "Company paper not found" });
    } else {
      res.status(200).json(companyPaper);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve company paper" });
  }
};
// Get a single company papers
const getCompanyPapers = async (req: Request, res: Response) => {
  try {
    const companyPapers = await store.indexByCompanyId(req.params.companyId);
    if (!companyPapers) {
      res.status(404).json({ error: "Company papers not found" });
    } else {
      res.status(200).json(companyPapers);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve company papers" });
  }
};

// Create a new company paper
const createCompanyPaper = async (req: Request, res: Response) => {
  try {
    const companyPaper: CompanyPaper = req.body;

    const newCompanyPaper = await store.create({ ...companyPaper });

    if (!newCompanyPaper) {
      res.status(400).json({ error: "Failed to create company paper in DB" });
    } else {
      res.status(201).json(newCompanyPaper);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to create company paper" });
  }
};

// Update a company paper
const updateCompanyPaper = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const updatedCompanyPaper = await store.update(req.params.paperId, updates);
    if (!updatedCompanyPaper) {
      res
        .status(404)
        .json({ error: "Company paper not found or failed to update" });
    } else {
      res.status(200).json(updatedCompanyPaper);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update company paper" });
  }
};

// Delete a company paper
const deleteCompanyPaper = async (req: Request, res: Response) => {
  try {
    const success = await store.destroy(req.params.paperId);
    if (success) {
      res.status(200).json({ message: "Company paper deleted successfully" });
    } else {
      res.status(404).json({ error: "Company paper not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete company paper" });
  }
};

// Define routes for company paper operations
const companyPapersRoutes = (app: Application) => {
  app.get("/companyPapers", [authorization], getAllCompanyPapers);
  app.get("/companyPapers/:paperId", [authorization], getCompanyPaper);
  app.get("/companyPapers/:companyId", getCompanyPapers);
  app.put("/companyPapers/:paperId", [authorization], updateCompanyPaper);
  app.delete("/companyPapers/:paperId", [authorization], deleteCompanyPaper);
  // add token again
  app.post("/companyPapers", createCompanyPaper);
};

export default companyPapersRoutes;
