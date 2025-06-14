import axios from "axios";
import { API_BASE_URL } from "@/config";

class ApplicationService {
  private static instance: ApplicationService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_BASE_URL}/applications`;
  }

  public static getInstance(): ApplicationService {
    if (!ApplicationService.instance) {
      ApplicationService.instance = new ApplicationService();
    }
    return ApplicationService.instance;
  }

  async withdrawApplication(applicationId: string): Promise<any> {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error withdrawing application:", error);
      throw error;
    }
  }

  async getUserApplications(page = 1, limit = 10, status?: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}`,
        {
          params: { page, limit, status },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user applications:", error);
      throw error;
    }
  }

  async applyForJob(jobId: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/job/${jobId}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error applying for job:", error);
      throw error;
    }
  }
}

export default ApplicationService; 