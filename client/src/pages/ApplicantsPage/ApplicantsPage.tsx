import { useEffect, useState } from "react";
import HttpService from "@/core/http.service";
import PortalLayout from "@/components/layouts/portal/PortalLayout";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const httpService = HttpService.getInstance();

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
  };
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  applied_date: string;
  resume_url: string;
}

const ApplicantsPage = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("all");

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await httpService.get<{ applicants: Applicant[] }>('/applicants', {
        params: {
          job_id: selectedJob !== "all" ? selectedJob : undefined,
          search: searchQuery
        }
      });
      setApplicants(response.data.applicants);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching applicants:', err);
      setError(err.response?.data?.message || 'Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [selectedJob, searchQuery]);

  const handleStatusChange = async (applicantId: string, newStatus: Applicant['status']) => {
    try {
      await httpService.put(`/applicants/${applicantId}`, { status: newStatus });
      fetchApplicants(); // Refresh the list
    } catch (err: any) {
      console.error('Error updating applicant status:', err);
      setError(err.response?.data?.message || 'Failed to update status');
    }
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
            {/* Add job options dynamically */}
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
                <li key={applicant._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-lg font-medium text-indigo-600">
                              {applicant.user_id.first_name[0]}{applicant.user_id.last_name[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {applicant.user_id.first_name} {applicant.user_id.last_name}
                          </h4>
                          <p className="text-sm text-gray-500">{applicant.user_id.email}</p>
                          <p className="text-sm text-gray-500">Applied for: {applicant.job_id.job_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-4">
                        <select
                          value={applicant.status}
                          onChange={(e) => handleStatusChange(applicant._id, e.target.value as Applicant['status'])}
                          className="block w-40 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <a
                          href={applicant.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          View Resume
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default ApplicantsPage; 