import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { IStores } from "@/interfaces";
import { IRegisterPayload } from "@/interfaces/models";
import AuthService from "@/services/auth.service";
import HttpService from "@/core/http.service";
import StorageService from "@/core/storage.service";

const httpService = HttpService.getInstance();

const initialState = {
  termsConditionsModalOpen: false,
  setTermsConditionsModalOpen: () => {},

  isLogging: false,
  loginError: "",
  login: () => {},
  clearLoginError: () => {},

  registerSuccessMessage: "",
  registerErrorMessage: "",
  register: () => {},
  clearRegisterMessages: () => {},
};

const useAuthStore = create<IStores.IAuthStore>((set) => ({
  ...initialState,

  // This functions will be used to open and close the terms and conditions modal
  setTermsConditionsModalOpen: (value) => {
    set({ termsConditionsModalOpen: value });
  },

  // This function is used to call the login endpoint
  login: async (payload) => {
    set({ isLogging: true });
    try {
      const authService = AuthService.getInstance();
      const response = await authService.login(payload);
      set({ isLogging: false });
      return response;
    } catch (error: any) {
      console.error(error);
      set({ isLogging: false });
      set({ loginError: error.response.data.message });
      throw error;
    }
  },

  // This function is used to call the register endpoint
  register: async (payload: IRegisterPayload) => {
    try {
      console.log('Auth store - Registering with payload:', payload);
      const authService = AuthService.getInstance();
      const response = await authService.register(payload);
      console.log('Auth store - Registration response:', response);

      // Check if registration was successful
      if (response.data.message === 'User account created successfully') {
        set({ registerSuccessMessage: response.data.message });
        return;
      }

      // If we have a user object, store it
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      set({ registerSuccessMessage: "Registration successful" });
    } catch (error: any) {
      console.error("Registration error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        status: error.status
      });
      
      // If it's a success message, treat it as success
      if (error.message === 'User account created successfully') {
        set({ registerSuccessMessage: error.message });
        return;
      }
      
      set({ registerErrorMessage: error.message || "Registration failed" });
      throw error;
    }
  },

  // This function is used to clear the login error message
  clearLoginError: () => {
    set({ loginError: "" });
  },

  // This function is used to clear the register success and error messages
  clearRegisterMessages: () => {
    set({ registerSuccessMessage: "" });
    set({ registerErrorMessage: "" });
  },
}));

export default useAuthStore;

if (import.meta.env.VITE_USER_NODE_ENV === "development") {
  mountStoreDevtool("AuthStore", useAuthStore);
}
