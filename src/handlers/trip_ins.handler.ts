import { Request, Response, Application } from "express";
import {
  createTripInstruction,
  getAllInstructionsByTripId,
  getTripInstructionById,
  updateTripInstruction,
  deleteTripInstruction,
} from "../models/trip_ins.model";

// Handler to get all instructions for a trip by trip ID
const getAllInstructionsByTripIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const instructions = await getAllInstructionsByTripId(tripId);
    res.status(200).json(instructions);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve instructions" });
  }
};

// Handler to get a single instruction by ID
const getTripInstructionHandler = async (req: Request, res: Response) => {
  try {
    const instructionId = parseInt(req.params.id);
    const instruction = await getTripInstructionById(instructionId);
    if (!instruction) {
      res.status(404).json({ error: "Instruction not found" });
    } else {
      res.status(200).json(instruction);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve instruction" });
  }
};

// Handler to create a new trip instruction
const createTripInstructionHandler = async (req: Request, res: Response) => {
  try {
    const newInstruction = req.body;
    const createdInstruction = await createTripInstruction(newInstruction);
    if (!createdInstruction) {
      res
        .status(400)
        .json({ error: "Failed to create trip instruction in DB" });
    } else {
      res.status(201).json(createdInstruction);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to create instruction" });
  }
};

// Handler to update an existing trip instruction
const updateTripInstructionHandler = async (req: Request, res: Response) => {
  try {
    const instructionId = parseInt(req.params.id);
    const updates = req.body;
    const updatedInstruction = await updateTripInstruction(
      instructionId,
      updates
    );
    if (!updatedInstruction) {
      res
        .status(404)
        .json({ error: "Instruction not found or failed to update" });
    } else {
      res.status(200).json(updatedInstruction);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update instruction" });
  }
};

// Handler to delete a trip instruction
const deleteTripInstructionHandler = async (req: Request, res: Response) => {
  try {
    const instructionId = parseInt(req.params.id);
    const success = await deleteTripInstruction(instructionId);
    if (success) {
      res.status(200).json({ message: "Instruction deleted successfully" });
    } else {
      res.status(404).json({ error: "Instruction not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to delete instruction" });
  }
};

// Trip instructions routes
const tripInstructionsRoutes = (app: Application) => {
  app.get("/trips/:tripId/instructions", getAllInstructionsByTripIdHandler);
  app.get("/instructions/:id", getTripInstructionHandler);
  app.post("/instructions", createTripInstructionHandler);
  app.put("/instructions/:id", updateTripInstructionHandler);
  app.delete("/instructions/:id", deleteTripInstructionHandler);
};

export default tripInstructionsRoutes;
