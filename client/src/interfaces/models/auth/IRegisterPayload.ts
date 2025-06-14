export interface IRegisterPayload {
  user_type_name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  // Job seeker fields
  phone?: string;
  address?: string;
  // Company specific fields
  company_name?: string;
  company_website_url?: string;
  establishment_date?: string;
  business_stream?: string;
  profile_description?: string;
}
