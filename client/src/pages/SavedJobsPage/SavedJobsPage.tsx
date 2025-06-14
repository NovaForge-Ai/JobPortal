import { useEffect, useState } from "react";
import HttpService from "@/core/http.service";
import PortalLayout from "@/components/layouts/portal/PortalLayout";
import { MagnifyingGlassIcon, BriefcaseIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const httpService = HttpService.getInstance();

interface SavedJob {
  _id: string;
  job_id: {
    _id: string;
    job_name: string;
    job_description: string;
    job_location: string;
    salary: string;
    requirements: string;
    required_qualifications: string;
    visa_sponsorship: boolean;
    travel_benefits: boolean;
    created_date: string;
    company_id?: {
      company_name: string;
    };
  };
  saved_date: string;
}

const SavedJobsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log('SavedJobsPage - Auth State:', { isAuthenticated, userType });
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }
    if (userType !== 'job_seeker') {
      console.log('User is not a job seeker, redirecting to home');
      navigate('/');
      return;
    }
  }, [isAuthenticated, userType, navigate]);

  const fetchSavedJobs = async () => {
    try {
      console.log('Fetching saved jobs...');
      setLoading(true);
      const response = await httpService.get<{ saved_jobs: SavedJob[] }>('/jobs/saved', {
        params: {
          search: searchQuery
        },
        headers: {
          ...httpService.getHeaders(),
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('Saved jobs response:', response);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      if (!response.data.saved_jobs) {
        throw new Error('Invalid response format: missing saved_jobs array');
      }
      
      setSavedJobs(response.data.saved_jobs);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching saved jobs:', {
        error: err,
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err.response?.data?.message || 'Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userType === 'job_seeker') {
      console.log('Fetching saved jobs on mount/update');
      fetchSavedJobs();
    }
  }, [searchQuery, isAuthenticated, userType]);

  const handleUnsaveJob = async (jobId: string) => {
    try {
      console.log('Unsave job request:', jobId);
      await httpService.delete(`/jobs/${jobId}/save`);
      setSavedJobs(prev => prev.filter(job => job.job_id._id !== jobId));
    } catch (err: any) {
      console.error('Error unsaving job:', {
        error: err,
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err.response?.data?.message || 'Failed to unsave job');
    }
  };

  if (!isAuthenticated || userType !== 'job_seeker') {
    return null;
  }

  return (
    <PortalLayout title="Saved Jobs">
      <div className="space-y-6">
        {/* Search Section */}
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
              placeholder="Search saved jobs..."
            />
          </div>
        </div>

        {/* Saved Jobs List */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading saved jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading saved jobs</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => fetchSavedJobs()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No saved jobs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {savedJobs.map((savedJob) => (
              <div
                key={savedJob._id}
                className="overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition-shadow"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex gap-x-4 justify-between">
                    <div className="flex gap-x-2">
                      <div className="rounded w-12 h-12 bg-gray-200 flex items-center justify-center">
                        <BriefcaseIcon className="h-6 w-6 text-indigo-600" />
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {savedJob.job_id.job_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {savedJob.job_id.company_id?.company_name || 'Company Information Not Available'}
                        </p>
                        <p className="text-sm text-gray-500">{savedJob.job_id.job_location}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <button
                        type="button"
                        onClick={() => handleUnsaveJob(savedJob.job_id._id)}
                        className="text-sm font-semibold text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
                      >
                        <BookmarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-x-2 mt-2">
                    {savedJob.job_id.visa_sponsorship && (
                      <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-700 ring-1 ring-inset ring-gray-600/10">
                        Visa Sponsorship
                      </span>
                    )}
                    {savedJob.job_id.travel_benefits && (
                      <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-700 ring-1 ring-inset ring-gray-600/10">
                        Travel Benefits
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-x-2 mt-2 justify-between">
                    <div className="flex items-center gap-x-2">
                      <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
                      <span className="text-sm text-gray-500">{savedJob.job_id.salary}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      Saved {new Date(savedJob.saved_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default SavedJobsPage;
