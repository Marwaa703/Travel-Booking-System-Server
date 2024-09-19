import { Order, Orders } from "../models/order";
import { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { authorization } from "./../middlewares/authorization";

dotenv.config();

const store = new Orders();

const index = async (_req: Request, res: Response) => {
  try {
    const user_id: number = parseInt(_req.params.user_id);
    const orders = await store.index(user_id);

    res.json(orders);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    const order = await store.show(id);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { user_id, status }: Order = req.body;

    const addedOrder = await store.create({ user_id, status });
    res.json(addedOrder);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const { status, user_id }: Order = req.body;

    const order = await store.update({ id, user_id, status });

    if (order) {
      res.json(order);
    } else {
      res.status(400).send(`order with id= ${id} not found!`);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    const deletedOrder = await store.destroy(id);

    if (deletedOrder) {
      res.json(deletedOrder);
    } else {
      res.status(400).send(`order with id= ${id} not found!`);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const orderRoutes = (app: Application) => {
  app.get("/api/orders/:user_id", [authorization], index);
  app.get("/api/orders/:id", [authorization], show);
  app.post("/api/orders", [authorization], create);
  app.put("/api/orders/:id", [authorization], update);
  app.delete("/api/orders/:id", [authorization], destroy);
};

export default orderRoutes;
