export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender?: string;
  phone: string;
  birthDate?: Date;
  role?: UserTypes;
}

export type UserTypes = "Admin" | "Company" | "Anonymous" | "User";
