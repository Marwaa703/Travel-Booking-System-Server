import { User, Users } from "../models/user";
import { Request, Response, Application } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authorization } from "./../middlewares/authorization";

dotenv.config();
const { SECRET_TOKEN } = process.env;

const store = new Users();

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id as unknown as number);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const newUser = await store.create(user);
    const token = jwt.sign(
      { first_name: newUser?.first_name, last_name: newUser?.last_name },
      SECRET_TOKEN as string
    );
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);

  const { first_name, last_name, username, password }: User = req.body;
  const user: User = { first_name, last_name, username, password };

  try {
    const updatedUser = await store.update({ ...user, id });

    res.status(202).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const deletedUser = await store.destroy(id);

    if (deletedUser) {
      res.json(deletedUser);
    } else {
      res.status(404).send("user not found");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(401).json({
        error: "Username or password are missing from the request body",
      });
    }
    const user = await store.authenticate(username, password);
    if (user) {
      const token = jwt.sign(
        { first_name: user?.first_name, last_name: user?.last_name },
        SECRET_TOKEN as string
      );

      res.json({ token });
    } else {
      res.status(404).json({ error: "Wrong username or password" });
    }
  } catch (error) {
    res.status(400).json({ error: "error" + error });
  }
};

const userRoutes = (app: Application) => {
  // token is required here as stated in REQUIREMENTS.md
  app.get("/api/users", [authorization], getAllUsers);
  app.get("/api/users/:id", [authorization], getUser);
  app.post("/api/users", [authorization], createUser);
  app.put("/api/users/:id", [authorization], updateUser);
  app.delete("/api/users/:id", [authorization], destroy);

  app.post("/api/login", authenticate);
  app.post("/api/signup", createUser);
};

export default userRoutes;
