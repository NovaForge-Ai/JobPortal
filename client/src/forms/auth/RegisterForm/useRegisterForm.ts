import { IRegisterPayload } from "@/interfaces/models";
import useAuthStore from "@/stores/auth.store";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const FORM_INITIAL_VALUES = {
  user_type_name: "job_seeker",
  email: "",
  password: "",
  confirmPassword: "",
  termsConditions: false,
  // Job seeker fields
  phone: "",
  address: "",
  // Company fields
  company_name: "",
  company_website_url: "",
  establishment_date: "",
  business_stream: "",
  profile_description: "",
};

const useRegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    registerSuccessMessage,
    registerErrorMessage,
    termsConditionsModalOpen,
    setTermsConditionsModalOpen,
    clearRegisterMessages,
  } = useAuthStore();

  const form = useFormik({
    initialValues: FORM_INITIAL_VALUES,
    validationSchema: Yup.object().shape({
      user_type_name: Yup.string().required("User type is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
      termsConditions: Yup.boolean()
        .oneOf([true], "You must accept the terms and conditions")
        .required("Terms and conditions must be accepted"),
      // Job seeker fields validation
      phone: Yup.string().when("user_type_name", {
        is: "job_seeker",
        then: (schema) => schema.required("Phone number is required"),
      }),
      address: Yup.string().when("user_type_name", {
        is: "job_seeker",
        then: (schema) => schema.required("Address is required"),
      }),
      // Company fields validation
      company_name: Yup.string().when("user_type_name", {
        is: "hr_recruiter",
        then: (schema) => schema
          .required("Company name is required")
          .min(2, "Company name must be at least 2 characters")
          .max(100, "Company name must not exceed 100 characters"),
      }),
      company_website_url: Yup.string().when("user_type_name", {
        is: "hr_recruiter",
        then: (schema) =>
          schema
            .required("Company website is required")
            .url("Must be a valid URL")
            .matches(
              /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
              "Please enter a valid website URL"
            ),
      }),
      establishment_date: Yup.date().when("user_type_name", {
        is: "hr_recruiter",
        then: (schema) => schema
          .required("Establishment date is required")
          .max(new Date(), "Establishment date cannot be in the future"),
      }),
      business_stream: Yup.string().when("user_type_name", {
        is: "hr_recruiter",
        then: (schema) => schema
          .required("Business stream is required")
          .test("is-valid-stream", "Please select a valid business stream", function(value) {
            return Boolean(value && value.length > 0);
          }),
      }),
      profile_description: Yup.string().when("user_type_name", {
        is: "hr_recruiter",
        then: (schema) => schema
          .required("Company profile description is required")
          .min(50, "Description must be at least 50 characters")
          .max(1000, "Description must not exceed 1000 characters")
          .test("no-special-chars", "Description contains invalid characters", value => {
            if (!value) return true;
            // Allow letters, numbers, spaces, and common punctuation
            return /^[a-zA-Z0-9\s.,!?-]+$/.test(value);
          }),
      }),
    }),
    onSubmit: async (values) => {
      try {
        // Structure the registration payload
        const registrationPayload: IRegisterPayload = {
          user_type_name: values.user_type_name,
          email: values.email,
          password: values.password,
          // Include job seeker data at root level if user is job seeker
          ...(values.user_type_name === "job_seeker" && {
            phone: values.phone,
            address: values.address,
          }),
          // Include company data at root level if user is HR recruiter
          ...(values.user_type_name === "hr_recruiter" && {
            company_name: values.company_name,
            company_website_url: values.company_website_url,
            establishment_date: values.establishment_date,
            business_stream: values.business_stream,
            profile_description: values.profile_description
          })
        };

        console.log('Submitting registration form with payload:', registrationPayload);
        console.log('Business stream ID:', values.business_stream);
        
        await register(registrationPayload);
        
        // Store user type in localStorage
        localStorage.setItem('user_type', values.user_type_name);
        
        // Reset form
        form.resetForm();
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (error: any) {
        console.error('Registration error:', error);
        // The error message will be set in the auth store
        // and displayed through registerErrorMessage
      }
    },
  });

  const handleOnOpenTermsConditionsModal = () => {
    setTermsConditionsModalOpen(true);
  };

  const handleOnCloseTermsConditionsModal = () => {
    setTermsConditionsModalOpen(false);
  };

  useEffect(() => {
    return () => {
      clearRegisterMessages();
    };
  }, [clearRegisterMessages]);

  return {
    form,
    registerSuccessMessage,
    registerErrorMessage,
    termsConditionsModalOpen,
    handleOnOpenTermsConditionsModal,
    handleOnCloseTermsConditionsModal,
  };
};

export default useRegisterForm;
