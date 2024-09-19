import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { staticUser } from "./testing";

dotenv.config();
const { SECRET_TOKEN } = process.env;

export const token = jwt.sign(
  { first_name: staticUser.first_name, last_name: staticUser.last_name },
  SECRET_TOKEN as string
);
