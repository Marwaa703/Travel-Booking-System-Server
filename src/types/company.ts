export interface Company {
  id?: string;
  name: string;
  address: string;
  logo: string;
  wallet?: string;
  approved?: boolean;
}

export interface CompanyPaper {
  companyId?: string;
  paperId?: string;
  imageUrl: string;
  title: string;
}

// 10-p
export interface CompanyUser {
  id?: string;
  companyId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  birthDate?: string;
  role: CompanyUserRoles;
  gender?: Gender;
}

export type CompanyUserRoles = "Representative" | "Support" | "TourGuide";
export type Gender = "male" | "female";
