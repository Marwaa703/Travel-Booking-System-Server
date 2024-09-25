import express from 'express';
import userRoutes from './handlers/user.handler';
import tripRoutes from './handlers/trip.handler';
import tripInsRoutes from './handlers/trip_ins.handler';
import bookedTripRoutes from './handlers/booked_trip.handler';

const app = express();
import bodyParser from 'body-parser'; 
app.use(express.json());
const PORT = process.env.PORT || 3001;


app.get("/", (req, res) => {
  res.status(200).send("VOYAGE Server is running.....");
});

userRoutes(app);
tripRoutes(app);
tripInsRoutes(app);
bookedTripRoutes(app); //^need to modify later after payment logic applied




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
