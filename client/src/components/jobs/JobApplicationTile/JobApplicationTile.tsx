import { BuildingOfficeIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface JobApplicationTileProps {
  job: {
    _id: string;
    job_name: string;
    company_name: string;
    location: string;
    salary: number;
    status: string;
  };
}

export const JobApplicationTile: React.FC<JobApplicationTileProps> = ({ job }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{job.job_name}</h3>
      <div className="mt-2 space-y-1">
        <div className="flex items-center text-gray-600">
          <BuildingOfficeIcon className="w-4 h-4 mr-2" />
          <span>{job.company_name}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPinIcon className="w-4 h-4 mr-2" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <CurrencyDollarIcon className="w-4 h-4 mr-2" />
          <span>{job.salary}</span>
        </div>
      </div>
      <div className="mt-4">
        <span className={`px-2 py-1 rounded-full text-sm ${
          job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          job.status === 'accepted' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {job.status}
        </span>
      </div>
    </div>
  );
}; 