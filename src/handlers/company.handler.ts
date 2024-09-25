import { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { authorization } from "../middlewares/authorization";
import { Companies, Company } from "../models/company.model";

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
    const company = await store.show(parseInt(req.params.id));
    if (!company) {
      res.status(404).json({ error: "company not found" });
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

    const newcompany = await store.create({ ...company });

    if (!newcompany) {
      res.status(400).json({ error: "Failed to create company in DB" });
    } else {
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to create company" });
  }
};

const updateCompany = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const updatedCompany = await store.update(parseInt(req.params.id), updates);
    if (!updatedCompany) {
      res.status(404).json({ error: "company not found or failed to update" });
    } else {
      res.status(200).json(updatedCompany);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update company" });
  }
};

const deleteCompany = async (req: Request, res: Response) => {
  try {
    const success = await store.destroy(parseInt(req.params.id));
    if (success) {
      res.status(200).json({ message: "company deleted successfully" });
    } else {
      res.status(404).json({ error: "company not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete company" });
  }
};

const companyRoutes = (app: Application) => {
  app.get("/voyage/companies", [authorization], getAllCompanies);
  app.get("/voyage/companies/:id", [authorization], getCompany);
  app.post("/voyage/companies", [authorization], createCompany);
  app.put("/voyage/companies/:id", [authorization], updateCompany);
  app.delete("/voyage/companies/:id", [authorization], deleteCompany);
};

export default companyRoutes;
