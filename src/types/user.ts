/* eslint-disable prettier/prettier */
export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender?: string;
  phone: string;
  birthdate?: Date;
}

export type UserTypes = "Admin" | "Company" | "Anonymous" | "User";
