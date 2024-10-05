import { Request, Response, Application } from "express";
import { authorization } from "../middlewares/authorization";
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../models/trip.model";

// Handler to get all trips
const getAllTripsHandler = async (_req: Request, res: Response) => {
  try {
    const trips = await getAllTrips();
    res.status(200).json(trips);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve trips" });
  }
};

// Handler to get a single trip by ID
const getTripHandler = async (req: Request, res: Response) => {
  try {
    const trip = await getTripById(req.params.id);
    if (!trip) {
      res.status(404).json({ error: "Trip not found" });
    } else {
      res.status(200).json(trip);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve trip" });
  }
};

// Handler to create a new trip
const createTripHandler = async (req: Request, res: Response) => {
  try {
    const trip = req.body;
    const newTrip = await createTrip(trip);
    if (!newTrip) {
      res.status(400).json({ error: "Failed to create trip in DB" });
    } else {
      res.status(201).json(newTrip);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to create trip" });
  }
};

// Handler to update a trip
const updateTripHandler = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const updatedTrip = await updateTrip(req.params.id, updates);
    if (!updatedTrip) {
      res.status(404).json({ error: "Trip not found or failed to update" });
    } else {
      res.status(200).json(updatedTrip);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update trip" });
  }
};

// Handler to delete a trip
const deleteTripHandler = async (req: Request, res: Response) => {
  try {
    const success = await deleteTrip(req.params.id);
    if (success) {
      res.status(200).json({ message: "Trip deleted successfully" });
    } else {
      res.status(404).json({ error: "Trip not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete trip" });
  }
};

// Trip routes
const tripRoutes = (app: Application) => {
  app.get("/trips", [authorization], getAllTripsHandler);
  app.get("/trips/:id", [authorization], getTripHandler);
  app.post("/trips", [authorization], createTripHandler);
  app.put("/trips/:id", [authorization], updateTripHandler);
  app.delete("/trips/:id", [authorization], deleteTripHandler);
};

export default tripRoutes;
