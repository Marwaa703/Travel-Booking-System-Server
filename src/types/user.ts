export interface User {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender?: string;
  phone: string;
  birth_date?: Date;
  role?: UserTypes;
}

export type UserTypes = "Admin" | "Company" | "Anonymous" | "User";
