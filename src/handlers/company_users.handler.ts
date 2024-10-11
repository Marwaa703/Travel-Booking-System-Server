import { Request, Response, Application } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { authorization } from "../middlewares/authorization";
import { CompanyUsers } from "../models/company_users.model";
import { CompanyUser } from "../types/company";

dotenv.config();
const { SECRET_TOKEN } = process.env;

const store = new CompanyUsers();

// Get all users
const getAllCompaniesUsers = async (_req: Request, res: Response) => {
  try {
    const companiesUsers = await store.index();
    res.status(200).json(companiesUsers);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve companiesUsers" });
  }
};

// Get users of company with id
const getCompanyUsers = async (req: Request, res: Response) => {
  try {
    const companyUsers = await store.indexCompany(req.params.companyId);
    if (!companyUsers.length) {
      res.status(404).json({ error: "No users found for this company" });
    } else {
      res.status(200).json(companyUsers);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve companyUsers" });
  }
};

// Get company user by companyId and userId
const getCompanyUser = async (req: Request, res: Response) => {
  try {
    const companyUser = await store.showCompanyUser(
      req.params.companyId,
      req.params.userId
    );
    if (!companyUser) {
      res.status(404).json({ error: "Company user not found" });
    } else {
      res.status(200).json(companyUser);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve companyUser" });
  }
};

// Get user by id
const getUser = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve user" });
  }
};

const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ error: "Email and password must be strings" });
    }

    const user = await store.indexUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email }, SECRET_TOKEN as string, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    return res.status(500).json({ error: "Failed to authenticate user" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user: CompanyUser = req.body;
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await store.create({ ...user, password: hashedPassword });

    if (!newUser) {
      res.status(400).json({ error: "Failed to create companyUser in DB" });
    } else {
      const token = jwt.sign(
        { name: newUser.first_name, email: newUser.email },
        SECRET_TOKEN as string
      );
      res.status(201).json({ token }); // Return the newly created user
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
        .json({ error: "CompanyUser not found or failed to update" });
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
      res.status(200).json({ message: "CompanyUser deleted successfully" });
    } else {
      res.status(404).json({ error: "CompanyUser not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete companyUser" });
  }
};

const companyUsersRoutes = (app: Application) => {
  app.get("/company/users", [authorization], getAllCompaniesUsers);
  app.get("/company/users/:companyId", getCompanyUsers);
  app.get("/company/users/:companyId/:userId", [authorization], getCompanyUser);
  app.get("/company/user/:userId", [authorization], getUser);
  app.put("/company/users/:id", [authorization], update);
  app.delete("/company/users/:id", [authorization], destroy);
  //
  app.post("/company/signup", create);
  app.post("/company/login", login);
};

export default companyUsersRoutes;
