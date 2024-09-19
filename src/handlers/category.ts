import { Category, Categorys } from "../models/category";
import { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { authorization } from "./../middlewares/authorization";

dotenv.config();

const store = new Categorys();

const index = async (_req: Request, res: Response) => {
  try {
    const categorys = await store.index();

    res.status(200).json(categorys);
  } catch (error) {
    res.status(400).json(error);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const category = await store.show(req.params.id as unknown as number);

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const updataedCategory: Category = { ...req.body, status: "active" };

    const category = await store.create(updataedCategory);
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json(error);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const { name }: Category = req.body;

    const category = await store.update({ name, id });

    if (category) {
      res.status(200).json(category);
    } else {
      res.status(400).send("category not found");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const category = await store.destroy(req.params.id as unknown as number);

    if (category) {
      res.status(202).json(category);
    } else {
      res.status(404).send("category not found");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

const categoryRoutes = (app: Application) => {
  app.get("/api/categorys", [authorization], index);
  app.get("/api/categorys/:id", [authorization], show);
  app.post("/api/categorys", [authorization], create);
  app.put("/api/categorys/:id", [authorization], update);
  app.delete("/api/categorys/:id", [authorization], destroy);
};

export default categoryRoutes;
