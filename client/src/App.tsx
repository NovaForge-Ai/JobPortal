import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import { AuthProvider } from "./providers/AuthProvider";
import { ToastProvider } from "./components/ui/toast-provider";

// Lazy load pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const PostJobPage = lazy(() => import("@/pages/PostJobPage/PostJobPage"));
const LoginPage = lazy(() => import("@/pages/AuthPages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/AuthPages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/AuthPages/ForgotPasswordPage"));
const MyJobsPage = lazy(() => import("@/pages/MyJobsPage"));
const SavedJobsPage = lazy(() => import("@/pages/SavedJobsPage"));
const MessagesPage = lazy(() => import("@/pages/MessagesPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<AppWrapper />}>
                <Route index element={<HomePage />} />
                <Route path="post-job" element={<PostJobPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="my-jobs" element={<MyJobsPage />} />
                <Route path="saved-jobs" element={<SavedJobsPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
