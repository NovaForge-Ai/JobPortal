import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import StorageService from "@/core/storage.service";
import AuthService from "@/services/auth.service";

export interface AuthContextProps {
  isAuthenticated: boolean;
  userType: string;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = StorageService.getItem("access_token");
    return !!token;
  });
  
  const [userType, setUserType] = useState<string>(() => {
    const user = StorageService.getItem("user");
    console.log('Initial user data from storage:', user);
    if (user) {
      const type = user.user_type || user.user_type_name;
      console.log('Initial user type:', type);
      return type || '';
    }
    return '';
  });

  const login = (token: string, user: any) => {
    console.log('Login called with user:', user);
    // Store token
    StorageService.setItem("access_token", token);
    
    // Store user data
    const userData = {
      ...user,
      user_type: user.user_type || user.user_type_name
    };
    console.log('Storing user data:', userData);
    StorageService.setItem("user", userData);
    
    // Store company ID if available
    if (user.company?._id) {
      console.log('AuthProvider - Storing company ID:', user.company._id);
      StorageService.setItem("company_id", user.company._id);
    }
    
    setIsAuthenticated(true);
    const type = userData.user_type || userData.user_type_name;
    console.log('Setting user type to:', type);
    setUserType(type);
  };

  const logout = () => {
    StorageService.removeItem("access_token");
    StorageService.removeItem("user");
    StorageService.removeItem("company_id");
    setIsAuthenticated(false);
    setUserType("");
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = StorageService.getItem("access_token");
        if (token) {
          const authService = AuthService.getInstance();
          const response = await authService.getCurrentUser();
          console.log('Current user response:', response);
          
          // Handle both direct user object and nested user object
          const userData = response.user || response;
          if (userData) {
            const processedUserData = {
              ...userData,
              user_type: userData.user_type || userData.user_type_name
            };
            console.log('Storing user data from current user:', processedUserData);
            StorageService.setItem("user", processedUserData);
            
            // Store company ID if available
            if (userData.company?._id) {
              console.log('AuthProvider - Storing company ID from current user:', userData.company._id);
              StorageService.setItem("company_id", userData.company._id);
            }
            
            const type = processedUserData.user_type || processedUserData.user_type_name;
            console.log('Setting user type from current user:', type);
            setUserType(type);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 