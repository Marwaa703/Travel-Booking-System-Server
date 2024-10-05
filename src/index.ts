import express from "express";
import userRoutes from "./handlers/user.handler";
import tripRoutes from "./handlers/trip.handler";
import tripInstructionsRoutes from "./handlers/trip_ins.handler";
import bookedTripRoutes from "./handlers/booked_trip.handler";

const app = express();
import bodyParser from "body-parser";
import companyRoutes from "./handlers/company.handler";
import companyUsersRoutes from "./handlers/company_users.handler";
import companyPapersRoutes from "./handlers/company_papers.handler";
import tripImageRoutes from "./handlers/trip_images.handler";
import tripLocationRoutes from "./handlers/trip_locations.handler";
app.use(express.json());
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.status(200).send("VOYAGE Server is running.....");
});

// DB tables
// user => done 1/1
userRoutes(app);

// Company, CompanyUsers, CompanyPapers, => done 3/3
companyRoutes(app);
companyUsersRoutes(app);
companyPapersRoutes(app);

// Trip, TripImages, TripLocations, TripInstructions, BookedTrips 5/5
tripRoutes(app);
tripImageRoutes(app);
tripLocationRoutes(app);
tripInstructionsRoutes(app);
bookedTripRoutes(app); //^need to modify later after payment logic applied
// total: 9

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
