import { Request, Response, Application } from "express";
import BookedTrips from "../models/booked_trip.model";
import { BookedTrip } from "../types/trip";

// Handler to create a new booked trip
const createBookedTripHandler = async (req: Request, res: Response) => {
  try {
    const newBooking: BookedTrip = req.body; 
    const bookedTrip = await BookedTrips.create(newBooking);
    if (!bookedTrip) {
      res.status(400).json({ error: "Failed to book the trip" });
    } else {
      res.status(201).json(bookedTrip);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to book the trip" });
  }
};

// Handler to get all booked trips for a user
const getAllBookedTripsByUserIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.userId; // Updated type
    const bookedTrips = await BookedTrips.getAllByUserId(userId);
    res.status(200).json(bookedTrips);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve booked trips" });
  }
};

// Handler to get all users who booked a specific trip
const getAllUsersForTripHandler = async (req: Request, res: Response) => {
  try {
    const tripId = req.params.tripId; // Updated type
    const users = await BookedTrips.getAllUsersForTrip(tripId);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve users" });
  }
};

// Handler to get a booked trip by its composite ID
const getBookedTripHandler = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id; // Updated type
    const bookedTrip = await BookedTrips.getById(bookingId);
    if (!bookedTrip) {
      res.status(404).json({ error: "Booked trip not found" });
    } else {
      res.status(200).json(bookedTrip);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve booked trip" });
  }
};

// Handler to delete a booked trip by its composite ID
const deleteBookedTripHandler = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id; // Updated type
    const success = await BookedTrips.delete(bookingId);
    if (success) {
      res.status(200).json({ message: "Booked trip deleted successfully" });
    } else {
      res.status(404).json({ error: "Booked trip not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete booked trip" });
  }
};

// Booked trips routes
const bookedTripRoutes = (app: Application) => {
  app.post("/booked_trip", createBookedTripHandler);
  app.get("/users/:userId/booked_trips", getAllBookedTripsByUserIdHandler);
  app.get("/trips/:tripId/booked_users", getAllUsersForTripHandler);
  app.get("/booked_trip/:id", getBookedTripHandler);
  app.delete("/booked_trip/:id", deleteBookedTripHandler);
};

export default bookedTripRoutes;
