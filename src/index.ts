import express from "express";
const app = express();
import bodyParser from "body-parser";
const cors = require("cors");
import userRoutes from "./handlers/user.handler";
import tripRoutes from "./handlers/trip.handler";
import tripInstructionsRoutes from "./handlers/trip_ins.handler";
import bookedTripRoutes from "./handlers/booked_trip.handler";
import companyRoutes from "./handlers/company.handler";
import companyUsersRoutes from "./handlers/company_users.handler";
import companyPapersRoutes from "./handlers/company_papers.handler";
import tripImageRoutes from "./handlers/trip_images.handler";
import tripLocationRoutes from "./handlers/trip_locations.handler";
import registerPaymentRoute from "./smartContract/payment";
import registerCompanyAndTripRoute from "./smartContract/addToBlockchain";
import { getAllUsers, updateUser } from "./models/user.model";
import bcrypt from "bcrypt";
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3002;

app.get("/", (req, res) => {
  res.status(200).send("VOYAGE Server is running.....");
});

// DB tables
// user => done 1/1
userRoutes(app);
//*Need to Validate the Eateries in signup endpoint

// Company, CompanyUsers, CompanyPapers, => done 3/3
companyRoutes(app);
companyUsersRoutes(app);
companyPapersRoutes(app);

// Trip, TripImages, TripLocations, TripInstructions, BookedTrips 5/5
tripRoutes(app);
tripImageRoutes(app);
tripLocationRoutes(app);
tripInstructionsRoutes(app);
bookedTripRoutes(app);
// total: 9

// Smart Contract Payment Integration
registerPaymentRoute(app);
registerCompanyAndTripRoute(app);

const server = `http://localhost:${PORT}`;
app.listen(PORT, () => {
  console.log(`Server is running on ${server}`);
});
