import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { SECRET_TOKEN } = process.env;

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    jwt.verify(token as string, SECRET_TOKEN as string);
    next();
  } catch (error) {
    res.status(401).json(`Access denied Invalid Token, error: ${error}`);
  }
};
