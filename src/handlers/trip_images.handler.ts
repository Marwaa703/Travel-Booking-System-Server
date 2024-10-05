import { Request, Response, Application } from "express";
import { authorization } from "../middlewares/authorization";
import { TripImages } from "../models/trip_images.model";
import { TripImage } from "../types/trip";

const store = new TripImages();

// Handler to create a new TripImage
const createTripImageHandler = async (req: Request, res: Response) => {
  try {
    const image: TripImage = req.body;
    const newImage = await store.create(image);
    if (!newImage) {
      res.status(400).json({ error: "Failed to create trip image" });
    } else {
      res.status(201).json(newImage);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to create trip image" });
  }
};

// Handler to get all images for a specific trip
const getImagesByTripIdHandler = async (req: Request, res: Response) => {
  try {
    const images = await store.getImagesByTripId(req.params.tripId);
    res.status(200).json(images);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve trip images" });
  }
};

// Handler to get a single TripImage by ID
const getTripImageHandler = async (req: Request, res: Response) => {
  try {
    const image = await store.show(req.params.id);
    if (!image) {
      res.status(404).json({ error: "Trip image not found" });
    } else {
      res.status(200).json(image);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve trip image" });
  }
};

// Handler to update a TripImage
const updateTripImageHandler = async (req: Request, res: Response) => {
  try {
    const updates: Partial<TripImage> = req.body;
    const updatedImage = await store.update(req.params.id, updates);
    if (!updatedImage) {
      res
        .status(404)
        .json({ error: "Trip image not found or failed to update" });
    } else {
      res.status(200).json(updatedImage);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update trip image" });
  }
};

// Handler to delete a TripImage
const deleteTripImageHandler = async (req: Request, res: Response) => {
  try {
    const success = await store.destroy(req.params.id);
    if (success) {
      res.status(200).json({ message: "Trip image deleted successfully" });
    } else {
      res.status(404).json({ error: "Trip image not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete trip image" });
  }
};

// TripImage routes
const tripImageRoutes = (app: Application) => {
  app.post("/tripImages", [authorization], createTripImageHandler);
  app.get("/tripImages/:tripId", [authorization], getImagesByTripIdHandler);
  app.get("/tripImages/:id", [authorization], getTripImageHandler);
  app.put("/tripImages/:id", [authorization], updateTripImageHandler);
  app.delete("/tripImages/:id", [authorization], deleteTripImageHandler);
};

export default tripImageRoutes;
