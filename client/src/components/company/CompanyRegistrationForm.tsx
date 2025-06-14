import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HttpService from "@/core/http.service";
import StorageService from "@/core/storage.service";

const httpService = HttpService.getInstance();

interface BusinessStream {
  _id: string;
  business_stream_name: string;
}

const CompanyRegistrationForm = () => {
  const navigate = useNavigate();
  const [businessStreams, setBusinessStreams] = useState<BusinessStream[]>([]);
  const [formData, setFormData] = useState({
    company_name: "",
    profile_description: "",
    business_stream_id: "",
    establishment_date: "",
    company_website_url: "",
  });

  useEffect(() => {
    // Fetch business streams
    const fetchBusinessStreams = async () => {
      try {
        const response = await httpService.get('/business-streams');
        setBusinessStreams(response.data);
      } catch (error) {
        console.error("Error fetching business streams:", error);
      }
    };

    fetchBusinessStreams();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = StorageService.getItem("access_token");
      if (!token) {
        console.error("No access token found. Please log in.");
        navigate("/login");
        return;
      }

      console.log('Submitting company registration with data:', formData);
      const response = await httpService.post('/companies', formData);
      console.log('Company registered successfully:', response);
      
      // Store the company ID in local storage for future use
      if (response.data && response.data._id) {
        console.log('Storing company ID:', response.data._id);
        // Ensure we're storing a string
        const companyId = response.data._id.toString();
        console.log('Company ID to store:', companyId);
        
        // Clear any existing company ID first
        StorageService.removeItem("company_id");
        console.log('Cleared existing company ID');
        
        // Store the new company ID
        StorageService.setItem("company_id", companyId);
        console.log('Stored new company ID');
        
        // Verify the company ID was stored correctly
        const storedCompanyId = StorageService.getItem("company_id");
        console.log('Stored company ID:', storedCompanyId);
        
        // Additional verification
        const rawStoredId = localStorage.getItem("company_id");
        console.log('Raw stored company ID from localStorage:', rawStoredId);
        
        if (!storedCompanyId) {
          console.error('Failed to store company ID. Storage verification failed.');
          throw new Error('Failed to store company ID');
        }

        // Store the company ID in the user's session
        const user = StorageService.getItem("user");
        if (user) {
          const updatedUser = {
            ...user,
            company_id: companyId
          };
          StorageService.setItem("user", updatedUser);
          console.log('Updated user with company ID:', updatedUser);
        }
      } else {
        console.error('No company ID in response:', response.data);
        throw new Error('No company ID received from server');
      }
      
      // Navigate to the post job page after successful registration
      navigate("/post-job");
    } catch (error: any) {
      console.error("Error registering company:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.error("Authentication failed. Please log in again.");
        navigate("/login");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Register Your Company</h1>
        <p className="mt-2 text-sm text-gray-600">Fill in your company details to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., Tech Solutions Inc."
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Business Stream</label>
            <select
              name="business_stream_id"
              value={formData.business_stream_id}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a business stream</option>
              {businessStreams.map((stream) => (
                <option key={stream._id} value={stream._id}>
                  {stream.business_stream_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Establishment Date</label>
            <input
              type="date"
              name="establishment_date"
              value={formData.establishment_date}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Company Website</label>
            <input
              type="url"
              name="company_website_url"
              value={formData.company_website_url}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="https://www.example.com"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Company Profile Description</label>
            <textarea
              name="profile_description"
              value={formData.profile_description}
              onChange={handleChange}
              rows={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Describe your company, its mission, values, and what makes it unique"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register Company
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyRegistrationForm; 