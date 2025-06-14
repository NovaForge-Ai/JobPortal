import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HttpService from "@/core/http.service";
import StorageService from "@/core/storage.service";
import LocationSelect from "@/components/core-ui/LocationSelect/LocationSelect";
import Alert from "@/components/core-ui/Alert";

const httpService = HttpService.getInstance();

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
];

const experienceLevels = [
  "Entry Level",
  "Junior",
  "Mid Level",
  "Senior",
  "Lead",
  "Manager",
];

const workModes = ["Remote", "On-site", "Hybrid"];

const benefits = [
  "Visa Sponsorship",
  "Health Insurance",
  "Dental Insurance",
  "Vision Insurance",
  "401(k)",
  "Paid Time Off",
  "Flexible Hours",
  "Professional Development",
];

const PostJobPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    job_name: "",
    required_qualifications: "",
    job_location: "",
    job_type: "",
    experience_level: "",
    work_mode: "",
    benefits: [] as string[],
    salary: "",
    description: "",
    requirements: "",
    companyId: "",
    is_active: true
  });

  useEffect(() => {
    // Get company ID from storage
    const companyId = StorageService.getItem("company_id");
    console.log('Retrieved company ID from storage:', companyId);
    console.log('Type of company ID:', typeof companyId);
    
    // Additional verification
    const rawCompanyId = localStorage.getItem("company_id");
    console.log('Raw company ID from localStorage:', rawCompanyId);
    console.log('Type of raw company ID:', typeof rawCompanyId);
    
    if (!companyId) {
      console.error('No company ID found in storage');
      setError("You need to register your company first before posting a job. Redirecting to company registration...");
      // Redirect to company registration after a short delay
      setTimeout(() => {
        navigate("/company-registration");
      }, 3000);
      return;
    }

    // Ensure companyId is a string and not undefined
    const companyIdStr = typeof companyId === 'string' ? companyId : companyId.toString();
    console.log('Converted company ID to string:', companyIdStr);
    
    if (companyIdStr === 'undefined') {
      console.error('Company ID is undefined');
      setError("Invalid company ID. Please complete your company registration first. Redirecting to company registration...");
      // Redirect to company registration after a short delay
      setTimeout(() => {
        navigate("/company-registration");
      }, 3000);
      return;
    }

    console.log('Setting company ID in form:', companyIdStr);
    setFormData(prev => ({ ...prev, companyId: companyIdStr }));
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBenefitsChange = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const handleLocationChange = (location: string | null) => {
    setFormData(prev => ({
      ...prev,
      job_location: location || ""
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

      if (!formData.companyId) {
        setError("No company ID found. Please complete your company registration first.");
        return;
      }

      const jobData = {
        ...formData,
        job_description: formData.description,
        is_company_name_hidden: false,
        created_date: new Date()
      };

      console.log('Submitting job with data:', jobData);
      const response = await httpService.post('/jobs', jobData);
      console.log('Job posted successfully:', response);
      navigate("/my-jobs");
    } catch (error: any) {
      console.error("Error posting job:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to post job. Please try again.");
      if (error.response?.status === 401) {
        console.error("Authentication failed. Please log in again.");
        navigate("/login");
      }
    }
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
        <p className="mt-2 text-sm text-gray-600">Fill in the details below to create a new job posting</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Job Name</label>
            <input
              type="text"
              name="job_name"
              value={formData.job_name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., Senior Software Engineer"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Job Type</label>
            <select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a job type</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Experience Level</label>
            <select
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select experience level</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Work Mode</label>
            <select
              name="work_mode"
              value={formData.work_mode}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select work mode</option>
              {workModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Benefits</label>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`benefit-${benefit}`}
                    checked={formData.benefits.includes(benefit)}
                    onChange={() => handleBenefitsChange(benefit)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`benefit-${benefit}`} className="ml-3 text-sm text-gray-700">
                    {benefit}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Job Location</label>
            <LocationSelect
              onLocationChange={handleLocationChange}
              initialValue={formData.job_location}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Salary Range</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., 80000"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Required Qualifications</label>
            <textarea
              name="required_qualifications"
              value={formData.required_qualifications}
              onChange={handleChange}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="List the required qualifications and skills"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Provide a detailed description of the job role and responsibilities"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="List specific requirements and expectations"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage; 