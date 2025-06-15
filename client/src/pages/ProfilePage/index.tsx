import React from 'react';
import { useAuth } from '../../providers/AuthProvider';
import JobSeekerProfilePage from './JobSeekerProfilePage';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { userType } = useAuth();

  if (userType === 'job_seeker') {
    return <JobSeekerProfilePage />;
  }

  // TODO: Add HR Recruiter profile page
  if (userType === 'hr_recruiter') {
    return <div>HR Recruiter Profile (Coming Soon)</div>;
  }

  return <Navigate to="/" />;
};

export default ProfilePage; 