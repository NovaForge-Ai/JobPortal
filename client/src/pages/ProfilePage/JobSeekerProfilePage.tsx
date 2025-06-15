import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';
import JobSeekerProfile from '@/components/profile/JobSeekerProfile';
import { IJobSeekerProfile } from '@/interfaces/models/user-account/IJobSeekerProfile';
import { useAuth } from '@/providers/AuthProvider';
import ProfileService from '@/services/profile.service';

const JobSeekerProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<IJobSeekerProfile | null>(null);
  
  const profileService = useMemo(() => new ProfileService(), []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await profileService.getJobSeekerProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate, profileService]);

  const handleProfileUpdate = async (updatedProfile: IJobSeekerProfile) => {
    try {
      const response = await profileService.updateJobSeekerProfile(updatedProfile);
      setProfile(response);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <JobSeekerProfile
      profile={profile}
      onUpdate={handleProfileUpdate}
    />
  );
};

export default JobSeekerProfilePage; 