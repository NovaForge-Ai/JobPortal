import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import AuthService from "@/services/auth.service";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
  loginError?: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values: LoginFormValues) => {
      try {
        console.log('Attempting login with values:', { email: values.email });
        const response = await AuthService.getInstance().login(values);
        console.log('Raw login response:', response);
        console.log('Response user object:', response.user);
        console.log('Response user object keys:', Object.keys(response.user));
        console.log('Response user object values:', Object.values(response.user));
        
        // Ensure we have a user object
        if (!response.user) {
          console.error('No user object in login response');
          throw new Error('Invalid login response: missing user data');
        }
        
        // Log user type information
        console.log('User type information:', {
          user_type: response.user.user_type,
          user_type_name: response.user.user_type_name,
          company: response.user.company,
          all_properties: response.user
        });
        
        // Get user type from either field
        const userType = response.user.user_type || response.user.user_type_name;
        console.log('User type to be stored:', userType);
        
        if (!userType) {
          console.error('No user type found in response. Full user object:', response.user);
          throw new Error('Invalid login response: missing user type');
        }
        
        // Store the user type in local storage
        localStorage.setItem('user_type', userType);
        
        // Log company information if available
        if (response.user.company) {
          console.log('Company information:', response.user.company);
        }
        
        await login(response.token, response.user);
        navigate("/");
      } catch (error: any) {
        console.error('Login error in form:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        // Get the error message from the server response
        let errorMessage = "Invalid email or password";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        formik.setErrors({ loginError: errorMessage });
      }
    },
  });

  return {
    formik,
  };
};
