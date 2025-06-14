import {
  BookmarkIcon as BookmarkOutlineIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, useCallback } from "react";
import HttpService from "@/core/http.service";
import PortalLayout from "@/components/layouts/portal/PortalLayout";
import { useAuth } from "@/providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import JobFilters, { JobFilters as JobFiltersType } from "@/components/jobs/JobFilters/JobFilters";
import JobDetailsModal from "@/components/jobs/JobDetailsModal/JobDetailsModal";
import debounce from "lodash/debounce";
import ApplicationService from "@/services/application.service";
import { toast } from "react-hot-toast";

const httpService = HttpService.getInstance();

interface Job {
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
  posted_by?: {
    email: string;
  };
  applicants_count?: number;
  is_saved?: boolean;
}

interface JobsResponse {
  jobs: Job[];
}

interface Application {
  _id: string;
  job_id: {
    _id: string;
    job_name: string;
    company_id: {
      company_name: string;
    };
    job_location: string;
    salary: string;
  };
  status: string;
  applied_date: string;
}

interface ApplicationsResponse {
  applications: Application[];
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

const HomePage = () => {
  const navigate = useNavigate();
  const { userType, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [filters, setFilters] = useState<JobFiltersType>({
    location: null,
    jobType: [],
    salaryRange: {
      min: null,
      max: null,
    },
    experienceLevel: [],
    workMode: [],
    benefits: [],
    postedDate: null,
  });
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const MAX_RETRIES = 3;
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  useEffect(() => {
    console.log('HomePage - Auth State:', { isAuthenticated, userType });
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }
    if (!userType) {
      console.log('User type not defined');
      setError('User type not defined. Please log in again.');
      return;
    }
  }, [isAuthenticated, userType, navigate]);

  // Create a debounced version of fetchJobs
  const debouncedFetchJobs = useCallback(
    debounce(async (page: number, search: string, currentFilters: JobFiltersType) => {
      try {
        setLoading(true);
        const endpoint = userType === "hr_recruiter" ? '/jobs/company' : '/jobs';
        
        // Build query parameters
        const params: any = {
          page,
          limit: 10,
          search
        };

        // Add filter parameters
        if (currentFilters.location) {
          params.location = currentFilters.location;
        }
        if (currentFilters.jobType.length > 0) {
          params.jobType = currentFilters.jobType;
        }
        if (currentFilters.salaryRange.min !== null) {
          params.minSalary = currentFilters.salaryRange.min;
        }
        if (currentFilters.salaryRange.max !== null) {
          params.maxSalary = currentFilters.salaryRange.max;
        }
        if (currentFilters.experienceLevel.length > 0) {
          params.experienceLevel = currentFilters.experienceLevel;
        }
        if (currentFilters.workMode.length > 0) {
          params.workMode = currentFilters.workMode;
        }
        if (currentFilters.benefits.length > 0) {
          params.benefits = currentFilters.benefits;
        }
        if (currentFilters.postedDate) {
          params.postedDate = currentFilters.postedDate;
        }
        
        // Log the full request details
        console.log('Fetching jobs with details:', {
          endpoint,
          fullUrl: `${httpService.getBaseUrl()}${endpoint}`,
          params,
          userType,
          isAuthenticated,
          headers: httpService.getHeaders()
        });
        
        if (!userType) {
          throw new Error('User type not defined');
        }

        // Make the request with explicit headers
        const response = await httpService.get<{ jobs: Job[], pagination: Pagination }>(
          endpoint,
          {
            params,
            headers: {
              ...httpService.getHeaders(),
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          }
        );
        
        // Log the raw response first
        console.log('Raw API Response:', response);
        
        // Log the full response
        console.log('Jobs API Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
          config: response.config
        });
        
        // Check if response exists
        if (!response) {
          console.error('No response received from server');
          throw new Error('No response received from server');
        }

        // Check if response.data exists
        if (!response.data) {
          console.error('No data in response:', response);
          throw new Error('No data received from server');
        }

        // Handle both possible response formats
        let jobsData: Job[];
        let paginationData: Pagination;

        if (Array.isArray(response.data)) {
          jobsData = response.data;
          paginationData = {
            total: jobsData.length,
            page: page,
            limit: 10,
            pages: Math.ceil(jobsData.length / 10)
          };
        } else if (response.data.jobs && Array.isArray(response.data.jobs)) {
          jobsData = response.data.jobs;
          paginationData = response.data.pagination || {
            total: jobsData.length,
            page: page,
            limit: 10,
            pages: Math.ceil(jobsData.length / 10)
          };
        } else {
          console.error('Invalid response data format:', response.data);
          throw new Error('Invalid jobs data format received from server');
        }

        // Validate jobs data
        if (!Array.isArray(jobsData)) {
          console.error('Invalid jobs data format:', response.data);
          throw new Error('Invalid jobs data format received from server');
        }

        // Log the processed data
        console.log('Processed jobs data:', jobsData);
        console.log('Processed pagination info:', paginationData);

        setJobs(jobsData);
        setPagination(paginationData);
        setError(null);
        setRetryCount(0);
      } catch (err: any) {
        // Enhanced error logging
        console.error('Error fetching jobs:', {
          error: err,
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config,
          stack: err.stack
        });
        
        // Check if it's a schema error
        const isSchemaError = err.response?.data?.message?.includes('Schema hasn\'t been registered');
        
        if (isSchemaError) {
          setError('The server is currently experiencing technical difficulties. Please try again later.');
          setJobs([]);
          setPagination(initialPagination);
          return;
        }

        // Check if it's an authentication error
        if (err.response?.status === 401) {
          console.log('Authentication error, redirecting to login');
          navigate('/login');
          return;
        }
        
        // For other errors, retry up to MAX_RETRIES times
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying fetch (attempt ${retryCount + 1} of ${MAX_RETRIES})...`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => debouncedFetchJobs(page, search, currentFilters), 2000);
          setError('Refreshing data...');
          return;
        }
        
        setError(err.response?.data?.message || 'Failed to fetch jobs. Please try again later.');
        setJobs([]);
        setPagination(initialPagination);
      } finally {
        setLoading(false);
      }
    }, 500),
    [userType, retryCount, navigate]
  );

  useEffect(() => {
    if (isAuthenticated && userType) {
      debouncedFetchJobs(1, searchQuery, filters);
    }
  }, [searchQuery, filters, isAuthenticated, userType, debouncedFetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedFetchJobs(1, searchQuery, filters);
  };

  const handleApply = async (jobId: string) => {
    try {
      const applicationService = ApplicationService.getInstance();
      await applicationService.applyForJob(jobId);
      toast.success('Application submitted successfully!');
      // Refresh job listings to update the UI
      debouncedFetchJobs(pagination.page, searchQuery, filters);
    } catch (error: any) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for job');
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      if (savedJobs.has(jobId)) {
        // Unsave job
        await httpService.delete(`/jobs/${jobId}/save`);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        // Save job
        await httpService.post(`/jobs/${jobId}/save`);
        setSavedJobs(prev => new Set(prev).add(jobId));
      }
    } catch (error: any) {
      console.error('Error saving/unsaving job:', error);
      alert(error.response?.data?.message || 'Failed to save/unsave job');
    }
  };

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (isAuthenticated && userType === 'job_seeker') {
        try {
          const response = await httpService.get<{ saved_jobs: { job_id: { _id: string } }[] }>('/jobs/saved');
          const savedJobsSet = new Set(response.data.saved_jobs.map(saved => saved.job_id._id));
          setSavedJobs(savedJobsSet);
        } catch (error) {
          console.error('Error fetching saved jobs:', error);
        }
      }
    };

    fetchSavedJobs();
  }, [isAuthenticated, userType]);

  const renderError = () => (
    <div className="text-center py-10">
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading jobs</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            {retryCount >= MAX_RETRIES && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setRetryCount(0);
                    debouncedFetchJobs(1, searchQuery, filters);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  if (!userType) {
    return (
      <PortalLayout title="Error">
        <div className="text-center py-10">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Please log in again to continue.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title={userType === "hr_recruiter" ? "Posted Jobs" : "Find Jobs"}>
      <main className="flex-1">
        {/* Jobs Search Area */}
        <form onSubmit={handleSearch} className="flex gap-x-4 justify-between">
          <div className="flex gap-x-4 mb-4">
            <div className="relative rounded-md shadow-sm w-80">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full h-10 rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder={userType === "hr_recruiter" ? "Search posted jobs..." : "Search jobs..."}
              />
            </div>

            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Search
            </button>
          </div>

          {userType === "hr_recruiter" && (
            <Link
              to="/post-job"
              className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Post a Job
            </Link>
          )}
        </form>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {userType === "hr_recruiter" ? "Posted Jobs" : "Search Results"}
          </h3>

          <div className="flex items-center gap-x-2">
            <span className="text-sm text-gray-500">
              {pagination?.total || 0} Results Found
            </span>
          </div>
        </div>

        <div className="flex gap-x-8">
          {/* Mobile Filters */}
          <div className="lg:hidden">
            <JobFilters onFilterChange={setFilters} isMobile={true} />
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block h-[calc(100vh-12rem)] overflow-y-auto pr-4">
            <JobFilters onFilterChange={setFilters} />
          </div>

          {/* Jobs List */}
          <div className="flex-1 h-[calc(100vh-12rem)] overflow-y-auto">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
              </div>
            ) : error ? (
              renderError()
            ) : jobs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600">No jobs found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex gap-x-4 justify-between">
                        <div className="flex gap-x-2">
                          <div className="rounded w-12 h-12 bg-gray-200 flex items-center justify-center">
                            <BriefcaseIcon className="h-6 w-6 text-indigo-600" />
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {job.job_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {job.company_id?.company_name}
                            </p>
                            <p className="text-sm text-gray-500">{job.job_location}</p>
                          </div>
                        </div>

                        {userType === "job_seeker" && (
                          <div className="flex items-start gap-x-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApply(job._id);
                              }}
                              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              Apply
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveJob(job._id);
                              }}
                              className={`text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 ${
                                savedJobs.has(job._id) ? 'text-indigo-600' : 'text-gray-900'
                              }`}
                            >
                              {savedJobs.has(job._id) ? (
                                <BookmarkSolidIcon className="h-5 w-5" />
                              ) : (
                                <BookmarkOutlineIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        )}

                        {userType === "hr_recruiter" && job.applicants_count !== undefined && (
                          <div className="flex items-center gap-x-2">
                            <Link
                              to={`/applicants?job_id=${job._id}`}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {job.applicants_count} Applicants
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-x-2 mt-2">
                        {job.visa_sponsorship && (
                          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-700 ring-1 ring-inset ring-gray-600/10">
                            Visa Sponsorship
                          </span>
                        )}
                        {job.travel_benefits && (
                          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-700 ring-1 ring-inset ring-gray-600/10">
                            Travel Benefits
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-x-2 mt-2 justify-between">
                        <div className="flex items-center gap-x-2">
                          <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
                          <span className="text-sm text-gray-500">{job.salary}</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(job.created_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Job Details Modal */}
            {selectedJob && (
              <JobDetailsModal
                isOpen={!!selectedJob}
                onClose={() => setSelectedJob(null)}
                job={selectedJob}
              />
            )}

            {/* Pagination */}
            {!loading && !error && pagination?.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-x-2">
                  <button
                    onClick={() => debouncedFetchJobs(pagination.page - 1, searchQuery, filters)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => debouncedFetchJobs(pagination.page + 1, searchQuery, filters)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>
    </PortalLayout>
  );
};

export default HomePage;
       