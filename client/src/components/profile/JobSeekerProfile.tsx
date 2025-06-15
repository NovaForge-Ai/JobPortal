import React, { useState } from 'react';
import { IJobSeekerProfile } from '../../interfaces/models/user-account/IJobSeekerProfile';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Chip,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

interface JobSeekerProfileProps {
  profile: IJobSeekerProfile;
  onUpdate: (profile: IJobSeekerProfile) => void;
  isEditing?: boolean;
}

const JobSeekerProfile: React.FC<JobSeekerProfileProps> = ({
  profile,
  onUpdate,
  isEditing = false,
}) => {
  const [editMode, setEditMode] = useState(isEditing);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    setEditMode(false);
    onUpdate(profile);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Profile
          </Typography>
          {!editMode && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Profile Header */}
          <Box sx={{ width: { xs: '100%', md: '25%' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={profile.profile_picture_url}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h6">
                {profile.first_name} {profile.last_name}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {profile.current_job_title}
              </Typography>
              {editMode && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Change Photo
                </Button>
              )}
            </Box>
          </Box>

          {/* Profile Details */}
          <Box sx={{ width: { xs: '100%', md: '75%' } }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Profile Summary
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={profile.profile_summary}
                  variant="outlined"
                />
              ) : (
                <Typography>{profile.profile_summary}</Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Contact Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography>{profile.user_id}</Typography>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                  <Typography variant="subtitle2">Phone</Typography>
                  <Typography>{profile.phone}</Typography>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2">Address</Typography>
                  <Typography>
                    {profile.address}, {profile.city}, {profile.state} {profile.postal_code}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Skills */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Skills</Typography>
                {editMode && (
                  <IconButton size="small">
                    <AddIcon />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={editMode ? () => {} : undefined}
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Work Experience */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Work Experience</Typography>
                {editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    size="small"
                  >
                    Add Experience
                  </Button>
                )}
              </Box>
              {profile.work_experience.map((exp, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">{exp.job_title}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {exp.company_name}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(exp.start_date).toLocaleDateString()} - 
                    {exp.is_current_job ? 'Present' : new Date(exp.end_date!).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {exp.description}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Education */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Education</Typography>
                {editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    size="small"
                  >
                    Add Education
                  </Button>
                )}
              </Box>
              {profile.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">{edu.degree}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {edu.institution}
                  </Typography>
                  <Typography variant="body2">
                    {edu.field_of_study} • {edu.graduation_year}
                  </Typography>
                </Box>
              ))}
            </Box>

            {editMode && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobSeekerProfile; 