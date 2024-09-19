import { ProductCategorys } from "../models/productCategorys";
import { Request, Response, Application } from "express";
import { authorization } from "./../middlewares/authorization";

const store = new ProductCategorys();
const addProductToCategory = async (req: Request, res: Response) => {
  try {
    const category_id: number = parseInt(req.params.id);

    const product_id: number = parseInt(req.body.product_id);

    const productDefinedCategory = store.addProductToCategorys(
      category_id,
      product_id
    );
    res.json(productDefinedCategory);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getCategoryProducts = async (req: Request, res: Response) => {
  try {
    const category_id: number = parseInt(req.params.id);
    const productDefinedCategory = store.getCategoryProducts(category_id);
    res.json(productDefinedCategory);
  } catch (error) {
    res.status(400).json(error);
  }
};
const productCategoryRoutes = (app: Application) => {
  app.post(
    "/api/categorys/:id/products",
    [authorization],
    addProductToCategory
  );
  app.get("/api/categorys/:id/products", [authorization], getCategoryProducts);
};

export default productCategoryRoutes;
