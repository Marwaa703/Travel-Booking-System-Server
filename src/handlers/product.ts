import { Product, Products } from "../models/product";
import { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { authorization } from "./../middlewares/authorization";

dotenv.config();

const store = new Products();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const product = await store.show(id);

    res.json(product);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { name, price, category, quantity }: Product = req.body;
    const addedProduct = await store.create({
      name,
      price,
      category,
      quantity,
    });
    res.json(addedProduct);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id, name, price, category, quantity }: Product = req.body;

    const updatedProduct = await store.update({
      id,
      name,
      price,
      category,
      quantity,
    });

    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(400).send(`product with id = ${id} not found`);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const deletedproduct = await store.destroy(id);

    if (deletedproduct) {
      res.json(deletedproduct);
    } else {
      res.status(400).send(`product with id = ${id} not found`);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const productRoutes = (app: Application) => {
  // token is not required here as stated in REQUIREMENTS.md
  app.get("/api/products", index);
  app.get("/api/products/:id", show);

  // token is required here
  app.post("/api/products", [authorization], create);
  app.put("/api/products/:id", [authorization], update);
  app.delete("/api/products/:id", [authorization], destroy);
};

export default productRoutes;
