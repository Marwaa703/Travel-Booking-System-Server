import { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { authorization } from "../middlewares/authorization";
import { CompanyUsers, CompanyUser } from "../models/company_users.model";

dotenv.config();

const store = new CompanyUsers();
// get all users
const getAllCompaniesUsers = async (_req: Request, res: Response) => {
  try {
    const companiesUsers = await store.index();
    res.status(200).json(companiesUsers);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve companiesUsers" });
  }
};

// get users of company with id
const getCompanyUsers = async (req: Request, res: Response) => {
  try {
    const companyUsers = await store.indexCompany(req.params.companyId);
    if (!companyUsers) {
      res.status(404).json({ error: "companyUsers not found" });
    } else {
      res.status(200).json(companyUsers);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve companyUsers" });
  }
};
// get company x user y
const getCompanyUser = async (req: Request, res: Response) => {
  try {
    const companyUser = await store.showCompanyUser(
      req.params.companyId,
      req.params.userId
    );
    if (!companyUser) {
      res.status(404).json({ error: "companyUser not found" });
    } else {
      res.status(200).json(companyUser);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve companyUser" });
  }
};
// get user by id
const getUser = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.userId);
    if (!user) {
      res.status(404).json({ error: "user not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve user" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user: CompanyUser = req.body;

    const newUser = await store.create({ ...user });

    if (!newUser) {
      res.status(400).json({ error: "Failed to create companyUser in DB" });
    } else {
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to create companyUser" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const user = await store.update(req.params.id, updates);
    if (!user) {
      res
        .status(404)
        .json({ error: "companyUser not found or failed to update" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update companyUser" });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const success = await store.destroy(req.params.id);
    if (success) {
      res.status(200).json({ message: "companyUser  deleted successfully" });
    } else {
      res.status(404).json({ error: "companyUser not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete companyUser" });
  }
};

const companyUsersRoutes = (app: Application) => {
  app.get("/voyage/companiesUsers", [authorization], getAllCompaniesUsers);
  app.get(
    "/voyage/companiesUsers/:companyId",
    [authorization],
    getCompanyUsers
  );
  app.get(
    "/voyage/companiesUsers/:companyId/:userId",
    [authorization],
    getCompanyUser
  );
  app.get("/voyage/companiesUsers/:userId", [authorization], getUser);
  app.post("/voyage/companiesUsers", [authorization], create);
  app.put("/voyage/companiesUsers/:id", [authorization], update);
  app.delete("/voyage/companiesUsers/:id", [authorization], destroy);
};

export default companyUsersRoutes;
