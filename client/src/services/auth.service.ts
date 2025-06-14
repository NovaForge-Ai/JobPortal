// AuthService.ts

// This service is responsible for handling authentication requests.

import HttpService from "@/core/http.service";
import { IModels } from "@/interfaces";
import { AxiosError } from "axios";
import StorageService from "@/core/storage.service";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    user_type_name: string;
    user_type?: string;
    company?: {
      _id: string;
      company_name: string;
    };
    [key: string]: any;
  };
}

class AuthService {
  private static instance: AuthService;
  private httpService: HttpService;

  private constructor() {
    this.httpService = HttpService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Login user
  public async login(payload: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('Login request payload:', { email: payload.email });
      const response = await this.httpService.post<LoginResponse>('/auth/login', payload);
      console.log('Raw login response:', response);
      console.log('Response data:', response.data);
      console.log('Response user object:', response.data.user);
      
      if (!response.data.user) {
        console.error('No user object in login response');
        throw new Error('Invalid login response: missing user data');
      }
      
      // Log all user properties
      console.log('All user properties:', response.data.user);
      
      // Set user type based on user_type_name
      if (response.data.user.user_type_name) {
        response.data.user.user_type = response.data.user.user_type_name;
        console.log('Set user type from user_type_name:', response.data.user.user_type_name);
      } else {
        console.error('No user type name found in response');
        throw new Error('Invalid login response: missing user type name');
      }
      
      console.log('Final user type:', response.data.user.user_type);
      
      // Store token
      if (response.data?.token) {
        console.log('Auth service - Setting access token:', response.data.token);
        StorageService.setItem("access_token", response.data.token);
        this.httpService.setAuthToken(response.data.token);
      } else {
        console.error('Auth service - No token in response:', response.data);
        throw new Error('Invalid login response: missing token');
      }

      // Store user data
      StorageService.setItem("user", response.data.user);

      // Store company ID if available
      if (response.data.user.user_type_name === 'hr_recruiter') {
        if (response.data.user.company?._id) {
          const companyId = response.data.user.company._id.toString();
          console.log('Auth service - Setting company ID:', companyId);
          
          // Clear any existing company ID first
          try {
            StorageService.removeItem("company_id");
          } catch (error) {
            console.warn('No existing company ID to clear');
          }
          
          // Store the new company ID
          StorageService.setItem("company_id", companyId);
          
          // Verify storage
          const storedCompanyId = StorageService.getItem("company_id");
          console.log('Auth service - Verified stored company ID:', storedCompanyId);
          
          if (!storedCompanyId) {
            console.error('Auth service - Failed to store company ID');
            throw new Error('Failed to store company ID');
          }
        } else {
          console.error('Auth service - No company data in login response for HR recruiter:', response.data.user);
          throw new Error('No company data found for HR recruiter');
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof AxiosError && error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      throw error;
    }
  }

  // Register user
  public async register(payload: any) {
    try {
      console.log('Auth service - Registering with payload:', payload);
      const response = await this.httpService.post("/auth/signup", payload);
      console.log('Auth service - Registration response:', response);
      
      // If we have a success message, return it
      if (response.data.message === 'User account created successfully') {
        // If this is an HR recruiter and we have company data, store it
        if (payload.user_type_name === "hr_recruiter" && response.data.user.company?._id) {
          const companyId = response.data.user.company._id.toString();
          console.log('Auth service - Setting company ID from registration:', companyId);
          
          // Clear any existing company ID first
          try {
            StorageService.removeItem("company_id");
          } catch (error) {
            console.warn('No existing company ID to clear');
          }
          
          // Store the new company ID
          StorageService.setItem("company_id", companyId);
          
          // Verify storage
          const storedCompanyId = StorageService.getItem("company_id");
          console.log('Auth service - Verified stored company ID:', storedCompanyId);
          
          if (!storedCompanyId) {
            console.error('Auth service - Failed to store company ID');
            throw new Error('Failed to store company ID');
          }
        }
        return response;
      }
      
      // If we have a user object, store it
      if (response.data.user) {
        StorageService.setItem("user", response.data.user);
      }
      
      return response;
    } catch (error: any) {
      console.error("Registration error:", error);
      // If it's an Axios error with a response, use the server's error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Get current user
  public async getCurrentUser() {
    try {
      const response = await this.httpService.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Logout user
  public async logout() {
    try {
      // Use StorageService consistently
      StorageService.removeItem("access_token");
      StorageService.removeItem("user");
      StorageService.removeItem("company_id");
      return await this.httpService.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
}

export default AuthService;
