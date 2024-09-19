import express from "express";
import dotenv from "dotenv";
// import cors from "cors";
import bodyParser from "body-parser";

import userRoutes from "./handlers/user";
import logger from "./middlewares/logger";
import productRoutes from "./handlers/product";
import orderRoutes from "./handlers/order";
import orderProductsRoutes from "./handlers/orderProducts";
import categoryRoutes from "./handlers/category";
import productCategoryRoutes from "./handlers/productCatgeoys";

const app = express();

dotenv.config();
const { PORT } = process.env;

// const corsOptions = {
//   origin: `http://localhost:${PORT}`,
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.use("/", logger);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("node server works");
});
// routes
userRoutes(app);
productRoutes(app);
orderRoutes(app);
orderProductsRoutes(app);
categoryRoutes(app);
productCategoryRoutes(app);

app.listen(PORT, () =>
  console.log(`node_server running on http://localhost:${PORT}`)
);

export default app;
