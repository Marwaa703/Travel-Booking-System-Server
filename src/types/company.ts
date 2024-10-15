export interface Company {
  id?: string;
  name: string;
  address: string;
  logo: string;
  wallet?: string;
  approved?: boolean;
}

export interface CompanyPaper {
  company_id?: string;
  paper_id?: string;
  image_url: string;
  title: string;
}

// 10-p
export interface CompanyUser {
  id?: string;
  company_id?: string;

  email: string;
  phone: string;
  password: string;
  role: CompanyUserRoles;
  gender?: Gender;

  first_name: string;
  last_name: string;
  birth_date?: string;
}

export type CompanyUserRoles = "Representative" | "Support" | "TourGuide";
export type Gender = "male" | "female";
