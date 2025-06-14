import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import StorageService from "./storage.service";

/// <reference types="vite/client" />

class HttpService {
  private static instance: HttpService;
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  private constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5053/api/v1";
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      withCredentials: true,
      // Add these options to handle CORS
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept all status codes less than 500
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService();
    }
    return HttpService.instance;
  }

  public getBaseUrl(): string {
    return this.baseURL;
  }

  public getHeaders(): Record<string, string> {
    const token = StorageService.getItem("access_token");
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = StorageService.getItem("access_token");
        console.log('Request interceptor - Token:', token);
        console.log('Request interceptor - URL:', config.url);
        console.log('Request interceptor - Method:', config.method);
        console.log('Request interceptor - Original headers:', config.headers);
        
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
          config.headers.Accept = "application/json";
          console.log('Request interceptor - Updated headers:', config.headers);
        } else {
          console.log('Request interceptor - No token found');
        }
        return config;
      },
      (error: unknown) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('Response interceptor - Status:', response.status);
        console.log('Response interceptor - Headers:', response.headers);
        console.log('Response interceptor - Data:', response.data);
        return response;
      },
      (error: any) => {
        console.error('Response interceptor - Error:', error);
        console.error('Response interceptor - Error response:', error.response);
        console.error('Response interceptor - Error data:', error.response?.data);
        console.error('Response interceptor - Error status:', error.response?.status);
        console.error('Response interceptor - Error message:', error.message);
        
        if (error.response?.status === 401) {
          console.log('Unauthorized access, clearing storage');
          StorageService.removeItem("access_token");
          StorageService.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      console.log('Making GET request to:', url);
      const requestConfig = {
        ...config,
        headers: this.getHeaders(),
        // Add these options to handle CORS
        withCredentials: true,
        validateStatus: function (status: number) {
          return status >= 200 && status < 500;
        },
      };
      console.log('Request config:', requestConfig);
      const response = await this.axiosInstance.get<T>(url, requestConfig);
      console.log('GET response:', response);
      return response;
    } catch (error: any) {
      console.error('GET request error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      console.log('Making POST request to:', url);
      console.log('Request data:', data);
      const requestConfig = {
        ...config,
        headers: this.getHeaders(),
        withCredentials: true,
      };
      const response = await this.axiosInstance.post<T>(url, data, requestConfig);
      console.log('POST response:', response);
      return response;
    } catch (error: any) {
      console.error('POST request error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      console.log('Making PUT request to:', url);
      console.log('Request data:', data);
      const requestConfig = {
        ...config,
        headers: this.getHeaders(),
        withCredentials: true,
      };
      const response = await this.axiosInstance.put<T>(url, data, requestConfig);
      console.log('PUT response:', response);
      return response;
    } catch (error: any) {
      console.error('PUT request error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      console.log('Making DELETE request to:', url);
      const requestConfig = {
        ...config,
        headers: this.getHeaders(),
        withCredentials: true,
      };
      const response = await this.axiosInstance.delete<T>(url, requestConfig);
      console.log('DELETE response:', response);
      return response;
    } catch (error: any) {
      console.error('DELETE request error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  }

  public setAuthToken(token: string) {
    console.log('Setting auth token:', token);
    StorageService.setItem("access_token", token);
    this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

export default HttpService;
