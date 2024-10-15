import { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { authorization } from "../middlewares/authorization";
import { Companies } from "../models/company.model";
import { Company } from "../types/company";

dotenv.config();

const store = new Companies();

const getAllCompanies = async (_req: Request, res: Response) => {
  try {
    const companies = await store.index();
    res.status(200).json(companies);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve companies" });
  }
};

const getCompany = async (req: Request, res: Response) => {
  try {
    const company = await store.show(req.params.id); // Changed to string
    if (!company) {
      res.status(404).json({ error: "Company not found" });
    } else {
      res.status(200).json(company);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve company" });
  }
};

const createCompany = async (req: Request, res: Response) => {
  try {
    const company: Company = req.body;

    const newCompany = await store.create({ ...company });

    if (!newCompany) {
      res.status(400).json({ error: "Failed to create company in DB" });
    } else {
      res.status(201).json(newCompany); // Return the newly created company
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to create company" });
  }
};

const updateCompany = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const updatedCompany = await store.update(req.params.id, updates); // Changed to string
    if (!updatedCompany) {
      res.status(404).json({ error: "Company not found or failed to update" });
    } else {
      res.status(200).json(updatedCompany);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update company" });
  }
};

const deleteCompany = async (req: Request, res: Response) => {
  try {
    const success = await store.destroy(req.params.id); // Changed to string
    if (success) {
      res.status(200).json({ message: "Company deleted successfully" });
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete company" });
  }
};

const companyRoutes = (app: Application) => {
  app.get("/companies", [authorization], getAllCompanies);
  app.get("/companies/:id", [authorization], getCompany);
  app.post("/companies", createCompany);
  app.put("/companies/:id", updateCompany);
  app.delete("/companies/:id", [authorization], deleteCompany);
};

export default companyRoutes;
