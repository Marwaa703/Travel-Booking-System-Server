import { OrderProduct, OrderProducts } from "../models/orderProducts";
import { Request, Response, Application } from "express";

import { authorization } from "./../middlewares/authorization";

const store = new OrderProducts();

const getOrderProducts = async (req: Request, res: Response) => {
  try {
    const order_id: number = parseInt(req.params.id);

    const orderProducts = await store.getOrderProducts(order_id);

    res.json(orderProducts);
  } catch (error) {
    res.status(400).json({ error });
  }
};
const addProductToOrder = async (req: Request, res: Response) => {
  try {
    const orderProduct: OrderProduct = req.body;
    const productAddedToOrder = store.addProductsToOrder(orderProduct);
    res.json(productAddedToOrder);
  } catch (error) {
    res.status(400).json({ error });
  }
};
const orderProductsRoutes = (app: Application) => {
  app.get("/api/orders/:id/products", [authorization], getOrderProducts);
  app.post("/api/orders/:id/products", [authorization], addProductToOrder);
};

export default orderProductsRoutes;
