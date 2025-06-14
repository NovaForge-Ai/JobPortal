import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";
import SuspenseLoader from "@/components/loaders/SuspenseLoader";

const HomePage = lazy(() => import("./pages/HomePage"));
const MyJobsPage = lazy(() => import("./pages/MyJobsPage"));
const SavedJobsPage = lazy(() => import("./pages/SavedJobsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const PostJobPage = lazy(() => import("./pages/PostJobPage/PostJobPage"));
const ApplicantsPage = lazy(() => import("./pages/ApplicantsPage/ApplicantsPage"));
const LoginPage = lazy(() => import("./pages/AuthPages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/AuthPages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/AuthPages/ForgotPasswordPage"));

const AppWrapper = () => {
  const { isAuthenticated, userType } = useAuth();
  
  console.log('AppWrapper render, isAuthenticated:', isAuthenticated);

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <HomePage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Job Seeker Routes */}
        <Route
          path="/my-jobs"
          element={
            isAuthenticated && userType === "job_seeker" ? (
              <MyJobsPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/saved-jobs"
          element={
            isAuthenticated && userType === "job_seeker" ? (
              <SavedJobsPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* HR Recruiter Routes */}
        <Route
          path="/post-job"
          element={
            isAuthenticated && userType === "hr_recruiter" ? (
              <PostJobPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/applicants"
          element={
            isAuthenticated && userType === "hr_recruiter" ? (
              <ApplicantsPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Common Protected Routes */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProfilePage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppWrapper;
