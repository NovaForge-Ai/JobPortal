import { IJobSeekerProfile } from '@/interfaces/models/user-account/IJobSeekerProfile';
import { API_BASE_URL } from '@/config';
import axios from 'axios';

class ProfileService {
  private baseUrl = `${API_BASE_URL}/profiles`;

  async getJobSeekerProfile(): Promise<IJobSeekerProfile> {
    const response = await axios.get(`${this.baseUrl}/job-seeker`);
    return response.data;
  }

  async updateJobSeekerProfile(profile: Partial<IJobSeekerProfile>): Promise<IJobSeekerProfile> {
    const response = await axios.put(`${this.baseUrl}/job-seeker`, profile);
    return response.data;
  }

  async uploadProfilePicture(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${this.baseUrl}/upload-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadResume(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${this.baseUrl}/upload-resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default ProfileService; 