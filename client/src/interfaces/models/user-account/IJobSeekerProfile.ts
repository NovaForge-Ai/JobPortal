export interface IJobSeekerProfile {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  profile_summary: string;
  current_job_title?: string;
  years_of_experience: number;
  education: {
    degree: string;
    field_of_study: string;
    institution: string;
    graduation_year: number;
  }[];
  skills: string[];
  work_experience: {
    company_name: string;
    job_title: string;
    start_date: Date;
    end_date?: Date;
    is_current_job: boolean;
    description: string;
  }[];
  resume_url?: string;
  profile_picture_url?: string;
  social_links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  preferred_job_types: string[];
  preferred_locations: string[];
  expected_salary?: number;
  created_at: Date;
  updated_at: Date;
} 