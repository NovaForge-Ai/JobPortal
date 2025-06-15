import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import JobSeekerProfile from '../../components/profile/JobSeekerProfile';
import { IJobSeekerProfile } from '../../interfaces/models/user-account/IJobSeekerProfile';
import { useAuth } from '../../providers/AuthProvider';

const JobSeekerProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<IJobSeekerProfile | null>(null);

  useEffect(() => {
    // TODO: Fetch profile data from API
    const fetchProfile = async () => {
      try {
        // Simulated profile data for now
        const mockProfile: IJobSeekerProfile = {
          _id: '1',
          user_id: user?.email || '',
          first_name: 'John',
          last_name: 'Doe',
          phone: '+1234567890',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postal_code: '10001',
          profile_summary: 'Experienced software developer with a passion for creating efficient and scalable solutions.',
          current_job_title: 'Senior Software Engineer',
          years_of_experience: 5,
          education: [
            {
              degree: 'Bachelor of Science',
              field_of_study: 'Computer Science',
              institution: 'University of Technology',
              graduation_year: 2018
            }
          ],
          skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
          work_experience: [
            {
              company_name: 'Tech Solutions Inc',
              job_title: 'Senior Software Engineer',
              start_date: new Date('2020-01-01'),
              is_current_job: true,
              description: 'Leading development of enterprise applications using React and Node.js'
            }
          ],
          preferred_job_types: ['Full-time', 'Remote'],
          preferred_locations: ['New York', 'Remote'],
          expected_salary: 120000,
          created_at: new Date(),
          updated_at: new Date()
        };
        setProfile(mockProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [user, isAuthenticated, navigate]);

  const handleProfileUpdate = async (updatedProfile: IJobSeekerProfile) => {
    try {
      // TODO: Implement API call to update profile
      console.log('Updating profile:', updatedProfile);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
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