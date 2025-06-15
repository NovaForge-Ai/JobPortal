import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import HttpService from '@/core/http.service';
import PortalLayout from '@/components/layouts/portal/PortalLayout';
import JobApplicationTile from '@/components/jobs/JobApplicationTile/JobApplicationTile';
import { toast } from 'react-hot-toast';

const httpService = HttpService.getInstance();

interface Application {
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
    benefits?: string[];
    created_date: string;
    company_id?: {
      company_name: string;
    };
  };
  status: string;
  applied_date: string;
}

interface ApplicationsResponse {
  applications: Application[];
  total: number;
  page: number;
  totalPages: number;
}

const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const { userType, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userType !== 'job_seeker') {
      navigate('/');
      return;
    }

    fetchApplications();
  }, [isAuthenticated, userType, navigate, currentPage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await httpService.get<ApplicationsResponse>('/applications/user', {
        params: {
          page: currentPage,
          limit: 10
        }
      });

      setApplications(response.data.applications);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setError(error.response?.data?.message || 'Failed to fetch applications');
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await httpService.put(`/applications/${applicationId}`, { status: newStatus });
      toast.success('Application status updated successfully');
      fetchApplications();
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast.error(error.response?.data?.message || 'Failed to update application status');
    }
  };

  if (!isAuthenticated || userType !== 'job_seeker') {
    return null;
  }

  return (
    <PortalLayout title="My Applications">
      <main className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            My Applications
          </h3>
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-gray-500">
              {applications.length} Applications
            </span>
          </div>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {applications.map((application) => (
              <JobApplicationTile
                key={application._id}
                application={application}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </main>
    </PortalLayout>
  );
};

export default MyApplicationsPage; 