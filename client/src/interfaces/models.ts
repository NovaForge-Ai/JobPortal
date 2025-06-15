export interface IRegisterPayload {
  user_type_name: string;
  email: string;
  password: string;
  // Company specific fields
  company_name?: string;
  company_website_url?: string;
  establishment_date?: string;
  business_stream?: string;
  profile_description?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: IUserAccount;
}

export interface IUserAccount {
  _id: string;
  email: string;
  user_type_name: string;
  user_type?: string;
  company?: {
    _id: string;
    company_name: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface IAuthContextProps {
  user: IUserAccount | null;
  isAuthenticated: boolean;
  login: (payload: ILoginPayload) => Promise<void>;
  register: (payload: IRegisterPayload) => Promise<void>;
  logout: () => void;
} 