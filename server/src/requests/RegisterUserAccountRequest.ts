import { IsDefined, IsEmail, MaxLength, MinLength, IsString, IsOptional } from "class-validator";

export class RegisterUserAccountRequest {
  @IsDefined({ message: "User account type is required" })
  @IsString({ message: "User type must be a string" })
  user_type_name!: string;

  @IsDefined({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsDefined({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(20, { message: "Password must not exceed 20 characters" })
  password!: string;

  // Optional fields for HR Recruiter
  @IsOptional()
  @IsString({ message: "Company name must be a string" })
  company_name?: string;

  @IsOptional()
  @IsString({ message: "Company website URL must be a string" })
  company_website_url?: string;

  @IsOptional()
  @IsString({ message: "Establishment date must be a string" })
  establishment_date?: string;

  @IsOptional()
  @IsString({ message: "Business stream must be a string" })
  business_stream?: string;

  @IsOptional()
  @IsString({ message: "Profile description must be a string" })
  profile_description?: string;
}
