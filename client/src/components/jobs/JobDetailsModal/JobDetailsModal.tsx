import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, BriefcaseIcon, CurrencyDollarIcon, MapPinIcon, AcademicCapIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
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
}

const JobDetailsModal = ({ isOpen, onClose, job }: JobDetailsModalProps) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900">
                      {job.job_name}
                    </Dialog.Title>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {job.company_id?.company_name || 'Company Information Not Available'}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-x-2">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">{job.job_location}</span>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">{job.salary}</span>
                      </div>
                    </div>

                    {job.job_description && (
                      <div className="mt-6">
                        <h4 className="text-lg font-medium text-gray-900">Job Description</h4>
                        <p className="mt-2 text-sm text-gray-500 whitespace-pre-wrap">
                          {job.job_description}
                        </p>
                      </div>
                    )}

                    {job.required_qualifications && (
                      <div className="mt-6">
                        <h4 className="text-lg font-medium text-gray-900">Required Qualifications</h4>
                        <p className="mt-2 text-sm text-gray-500 whitespace-pre-wrap">
                          {job.required_qualifications}
                        </p>
                      </div>
                    )}

                    {job.requirements && (
                      <div className="mt-6">
                        <h4 className="text-lg font-medium text-gray-900">Requirements</h4>
                        <p className="mt-2 text-sm text-gray-500 whitespace-pre-wrap">
                          {job.requirements}
                        </p>
                      </div>
                    )}

                    {((job.benefits && job.benefits.length > 0) || job.visa_sponsorship || job.travel_benefits) && (
                      <div className="mt-6">
                        <h4 className="text-lg font-medium text-gray-900">Benefits</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.benefits?.map((benefit) => (
                            <span key={benefit} className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              {benefit}
                            </span>
                          ))}
                          {job.visa_sponsorship && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Visa Sponsorship
                            </span>
                          )}
                          {job.travel_benefits && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Travel Benefits
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <p className="text-sm text-gray-500">
                        Posted on {new Date(job.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default JobDetailsModal; 