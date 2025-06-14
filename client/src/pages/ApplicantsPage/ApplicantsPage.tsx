import { useEffect, useState } from "react";
import HttpService from "@/core/http.service";
import PortalLayout from "@/components/layouts/portal/PortalLayout";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const httpService = HttpService.getInstance();

interface Job {
  _id: string;
  job_name: string;
  company_id: {
    _id: string;
    company_name: string;
  };
}

interface Applicant {
  _id: string;
  job_id: {
    _id: string;
    job_name: string;
  };
  user_id: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address?: string;
    education?: { degree: string; field: string; institution: string; graduation_year: string }[];
    experience?: { position: string; company: string; start_date: string; end_date?: string; description: string }[];
    skills?: string[];
  };
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  applied_date: string;
  resume_url: string;
}

interface ApplicationsResponse {
  applications: Applicant[];
  total: number;
  page: number;
  totalPages: number;
}

const ApplicantsPage = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  const fetchJobs = async () => {
    try {
      const response = await httpService.get<{ jobs: Job[] }>('/jobs/company');
      if (response.data && Array.isArray(response.data.jobs)) {
        setJobs(response.data.jobs);
      } else {
        setJobs([]);
      }
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to fetch jobs');
      setJobs([]);
    }
  };

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      let response;
      
      if (selectedJob === "all") {
        // If "all" is selected, we need to fetch applications for each job
        const allApplications: Applicant[] = [];
        for (const job of jobs) {
          const jobResponse = await httpService.get<ApplicationsResponse>(`/applications/job/${job._id}`, {
            params: {
              search: searchQuery
            }
          });
          if (jobResponse.data && Array.isArray(jobResponse.data.applications)) {
            allApplications.push(...jobResponse.data.applications);
          }
        }
        setApplicants(allApplications);
      } else {
        // Fetch applications for a specific job
        response = await httpService.get<ApplicationsResponse>(`/applications/job/${selectedJob}`, {
          params: {
            search: searchQuery
          }
        });
        
        if (response.data && Array.isArray(response.data.applications)) {
          setApplicants(response.data.applications);
        } else {
          setApplicants([]);
        }
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching applicants:', err);
      setError(err.response?.data?.message || 'Failed to fetch applicants');
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      fetchApplicants();
    }
  }, [selectedJob, searchQuery, jobs]);

  const handleStatusChange = async (applicantId: string, newStatus: Applicant['status']) => {
    try {
      await httpService.put(`/applications/${applicantId}`, { status: newStatus });
      fetchApplicants(); // Refresh the list
    } catch (err: any) {
      console.error('Error updating applicant status:', err);
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getInitials = (applicant: Applicant) => {
    const firstName = applicant.user_id?.first_name || '';
    const lastName = applicant.user_id?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const handleApplicantClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
  };

  const closeModal = () => {
    setSelectedApplicant(null);
  };

  return (
    <PortalLayout title="Applicants">
      <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className="flex gap-x-4 items-center">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search applicants..."
            />
          </div>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="block w-64 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="all">All Jobs</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.job_name}
              </option>
            ))}
          </select>
        </div>

        {/* Applicants List */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applicants...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading applicants</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No applicants found</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {applicants.map((applicant) => (
                <li 
                  key={applicant._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleApplicantClick(applicant)}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-lg font-medium text-indigo-600">
                              {getInitials(applicant)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {applicant.user_id?.first_name} {applicant.user_id?.last_name}
                          </h4>
                          <p className="text-sm text-gray-500">{applicant.user_id?.email}</p>
                          <p className="text-sm text-gray-500">Applied for: {applicant.job_id?.job_name}</p>
                          <p className="text-sm text-gray-500">
                            Applied on: {new Date(applicant.applied_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-4">
                        <select
                          value={applicant.status}
                          onChange={(e) => handleStatusChange(applicant._id, e.target.value as Applicant['status'])}
                          className="block w-40 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Applicant Details Modal */}
        {selectedApplicant && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-2xl font-medium text-indigo-600">
                        {getInitials(selectedApplicant)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedApplicant.user_id?.first_name} {selectedApplicant.user_id?.last_name}
                      </h2>
                      <p className="text-gray-600">{selectedApplicant.user_id?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Phone:</span> {selectedApplicant.user_id?.phone || 'Not provided'}</p>
                      <p><span className="font-medium">Address:</span> {selectedApplicant.user_id?.address || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Applied for:</span> {selectedApplicant.job_id?.job_name}</p>
                      <p><span className="font-medium">Applied on:</span> {new Date(selectedApplicant.applied_date).toLocaleDateString()}</p>
                      <p><span className="font-medium">Status:</span> {selectedApplicant.status}</p>
                    </div>
                  </div>

                  {/* Education */}
                  {selectedApplicant.user_id?.education && selectedApplicant.user_id.education.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Education</h3>
                      <div className="space-y-4">
                        {selectedApplicant.user_id.education.map((edu, index) => (
                          <div key={index} className="border-l-4 border-indigo-200 pl-4">
                            <p className="font-medium">{edu.degree} in {edu.field}</p>
                            <p>{edu.institution}</p>
                            <p className="text-gray-600">Graduated: {edu.graduation_year}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {selectedApplicant.user_id?.experience && selectedApplicant.user_id.experience.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                      <div className="space-y-4">
                        {selectedApplicant.user_id.experience.map((exp, index) => (
                          <div key={index} className="border-l-4 border-indigo-200 pl-4">
                            <p className="font-medium">{exp.position}</p>
                            <p>{exp.company}</p>
                            <p className="text-gray-600">
                              {new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                            </p>
                            <p className="mt-2">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {selectedApplicant.user_id?.skills && selectedApplicant.user_id.skills.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.user_id.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Resume Download */}
                {selectedApplicant.resume_url && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <a
                      href={selectedApplicant.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Download Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default ApplicantsPage; 