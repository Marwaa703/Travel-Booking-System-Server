import { Request, Response, Application } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { authorization } from "../middlewares/authorization";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
} from "../models/user.model";

dotenv.config();
const { SECRET_TOKEN } = process.env;

const getAllUsersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve users" });
  }
};

const getUserHandler = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id); // Changed to string
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve user" });
  }
};

const createUserHandler = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await createUser({ ...user, password: hashedPassword });

    if (!newUser) {
      res.status(400).json({ error: "Failed to create user in DB" });
    } else {
      const token = jwt.sign(
        { name: newUser.firstName, email: newUser.email }, 
        SECRET_TOKEN as string
      );
      res.status(201).json({ token });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" });
  }
};

const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const updatedUser = await updateUser(req.params.id, updates); // Changed to string
    if (!updatedUser) {
      res.status(404).json({ error: "User not found or failed to update" });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update user" });
  }
};

const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const success = await deleteUser(req.params.id); // Changed to string
    if (success) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete user" });
  }
};const authenticateHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: "Email and password must be strings" });
    }

    const user = await getUserByEmail(email); // Ensure this function returns user details
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

    // Return user details along with the token
    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user
    });
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    return res.status(500).json({ error: "Failed to authenticate user" });
  }
};



const userRoutes = (app: Application) => {
  app.get("/voyage/users", [authorization], getAllUsersHandler);
  app.get("/voyage/users/:id", [authorization], getUserHandler);
  app.post("/voyage/users", [authorization], createUserHandler);
  app.put("/voyage/users/:id", [authorization], updateUserHandler);
  app.delete("/voyage/users/:id", [authorization], deleteUserHandler);

  app.post("/voyage/login", authenticateHandler);
  app.post("/voyage/signup", createUserHandler);
};

export default userRoutes;
