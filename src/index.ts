import express from "express";
import userRoutes from "./handlers/user.handler";
import tripRoutes from "./handlers/trip.handler";
import tripInsRoutes from "./handlers/trip_ins.handler";
import bookedTripRoutes from "./handlers/booked_trip.handler";

const app = express();
import bodyParser from "body-parser";
import companyRoutes from "./handlers/company.handler";
import companyUsersRoutes from "./handlers/company_users.handler";
app.use(express.json());
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.status(200).send("VOYAGE Server is running.....");
});

userRoutes(app);
companyRoutes(app);
companyUsersRoutes(app);
tripRoutes(app);
tripInsRoutes(app);
bookedTripRoutes(app); //^need to modify later after payment logic applied

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
