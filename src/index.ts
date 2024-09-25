import express from "express";
import userRoutes from "./handlers/user.handler";

const app = express();
import bodyParser from "body-parser";
import companyRoutes from "./handlers/company.handler";
import companyUsersRoutes from "./handlers/company_users.handler";

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("VOYAGE Server is running.....");
});

userRoutes(app);
companyRoutes(app);
companyUsersRoutes(app);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
