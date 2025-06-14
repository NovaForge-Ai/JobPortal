import { useEffect, useState } from "react";
import HttpService from "@/core/http.service";
import PortalLayout from "@/components/layouts/portal/PortalLayout";
import { MagnifyingGlassIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import JobDetailsModal from "@/components/jobs/JobDetailsModal/JobDetailsModal";
import ApplicationService from "@/services/application.service";

const httpService = HttpService.getInstance();

interface JobDetails {
  _id: string;
  job_name: string;
  job_description: string;
  job_location: string;
  salary: string;
  requirements: string;
  required_qualifications: string;
  visa_sponsorship: boolean;
  travel_benefits: boolean;
  benefits?: string[];
  created_date: string;
  company_id?: {
    company_name: string;
  };
}

interface JobApplication {
  _id: string;
  job_id: {
    _id: string;
    job_name: string;
    job_description?: string;
    requirements?: string;
    required_qualifications?: string;
    company_id?: {
      company_name: string;
    };
    job_location: string;
    salary: string;
    visa_sponsorship?: boolean;
    travel_benefits?: boolean;
    created_date?: string;
  };
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  applied_date: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const initialPagination: Pagination = {
  total: 0,
  page: 1,
  limit: 10,
  pages: 0
};

const MyJobsPage = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);

  const fetchApplications = async (page: number = 1) => {
    try {
      setLoading(true);
      const applicationService = ApplicationService.getInstance();
      const response = await applicationService.getUserApplications(page, 10, statusFilter !== "all" ? statusFilter : undefined);
      // Ensure we have valid data
      const validApplications = (response.applications || []).filter((app: any) => 
        app && app.job_id && app.job_id.job_name
      );
      setApplications(validApplications);
      setPagination({
        total: response.total,
        page: response.page,
        limit: 10,
        pages: response.totalPages || 0
      });
      setError(null);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || 'Failed to fetch applications');
      setApplications([]);
      setPagination(initialPagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(1);
  }, [statusFilter, searchQuery, sortBy, sortOrder]);

  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      const applicationService = ApplicationService.getInstance();
      await applicationService.withdrawApplication(applicationId);
      fetchApplications(pagination.page);
    } catch (err: any) {
      console.error('Error withdrawing application:', err);
      setError(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusTimeline = (status: JobApplication['status']) => {
    const steps = [
      { id: 'pending', label: 'Applied' },
      { id: 'reviewed', label: 'Under Review' },
      { id: 'shortlisted', label: 'Shortlisted' },
      { id: 'rejected', label: 'Rejected' }
    ];

    const currentIndex = steps.findIndex(step => step.id === status);
    
    return (
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${
              index <= currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
            }`} />
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${
                index < currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <PortalLayout title="My Applications">
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
              placeholder="Search applications..."
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy);
              setSortOrder(newSortOrder as "asc" | "desc");
            }}
            className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="status-asc">Status A-Z</option>
            <option value="status-desc">Status Z-A</option>
          </select>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading applications</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-medium text-gray-900 truncate cursor-pointer hover:text-indigo-600"
                            onClick={() => setSelectedJob(application)}>
                          {application.job_id?.job_name || 'Job Title Not Available'}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {application.job_id?.company_id?.company_name || 'Company Name Not Available'}
                        </p>
                        <div className="mt-2 flex items-center gap-x-4">
                          <p className="text-sm text-gray-500">
                            {application.job_id?.job_location || 'Location Not Available'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {application.job_id?.salary || 'Salary Not Available'}
                          </p>
                        </div>
                        <div className="mt-2">
                          {getStatusTimeline(application.status)}
                        </div>
                      </div>
                      <div className="flex items-center gap-x-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Applied {new Date(application.applied_date).toLocaleDateString()}
                        </span>
                        {application.status === 'pending' && (
                          <button
                            onClick={() => handleWithdrawApplication(application._id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.pages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-x-2">
              <button
                onClick={() => fetchApplications(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchApplications(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Job Details Modal */}
        {selectedJob && (
          <JobDetailsModal
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
            job={selectedJob.job_id as unknown as JobDetails}
          />
        )}
      </div>
    </PortalLayout>
  );
};

export default MyJobsPage;
