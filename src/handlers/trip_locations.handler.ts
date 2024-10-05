import { Request, Response, Application } from "express";
import { authorization } from "../middlewares/authorization";
import { TripLocations } from "../models/trip_locations.model";
import { TripLocation } from "../types/trip";

const store = new TripLocations();

// Handler to create a new TripLocation
const createTripLocationHandler = async (req: Request, res: Response) => {
  try {
    const location: TripLocation = req.body;
    const newLocation = await store.create(location);
    if (!newLocation) {
      res.status(400).json({ error: "Failed to create trip location" });
    } else {
      res.status(201).json(newLocation);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to create trip location" });
  }
};

// Handler to get all locations for a specific trip
const getLocationsByTripIdHandler = async (req: Request, res: Response) => {
  try {
    const locations = await store.getLocationsByTripId(req.params.tripId);
    res.status(200).json(locations);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve trip locations" });
  }
};

// Handler to get a single TripLocation by ID
const getTripLocationHandler = async (req: Request, res: Response) => {
  try {
    const location = await store.show(req.params.id);
    if (!location) {
      res.status(404).json({ error: "Trip location not found" });
    } else {
      res.status(200).json(location);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve trip location" });
  }
};

// Handler to update a TripLocation
const updateTripLocationHandler = async (req: Request, res: Response) => {
  try {
    const updates: Partial<TripLocation> = req.body;
    const updatedLocation = await store.update(req.params.id, updates);
    if (!updatedLocation) {
      res
        .status(404)
        .json({ error: "Trip location not found or failed to update" });
    } else {
      res.status(200).json(updatedLocation);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update trip location" });
  }
};

// Handler to delete a TripLocation
const deleteTripLocationHandler = async (req: Request, res: Response) => {
  try {
    const success = await store.destroy(req.params.id);
    if (success) {
      res.status(200).json({ message: "Trip location deleted successfully" });
    } else {
      res.status(404).json({ error: "Trip location not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete trip location" });
  }
};

// TripLocation routes
const tripLocationRoutes = (app: Application) => {
  app.post("/tripLocations", [authorization], createTripLocationHandler);
  app.get(
    "/tripLocations/:tripId",
    [authorization],
    getLocationsByTripIdHandler
  );
  app.get("/tripLocations/:id", [authorization], getTripLocationHandler);
  app.put("/tripLocations/:id", [authorization], updateTripLocationHandler);
  app.delete("/tripLocations/:id", [authorization], deleteTripLocationHandler);
};

export default tripLocationRoutes;
