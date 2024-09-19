import { Request, Response, NextFunction } from "express";
const logger = (req: Request, _res: Response, next: NextFunction): void => {
  const url = "localhost:" + process.env.PORT + req.originalUrl;
  console.log(`${url} has been visited on ${new Date()}`);
  next();
};

export default logger;
