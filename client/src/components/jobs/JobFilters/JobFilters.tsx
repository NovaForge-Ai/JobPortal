import { Fragment, useState, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import LocationSelect from "@/components/core-ui/LocationSelect/LocationSelect";
import debounce from "lodash/debounce";

interface JobFiltersProps {
  onFilterChange: (filters: JobFilters) => void;
  isMobile?: boolean;
}

export interface JobFilters {
  location: string | null;
  jobType: string[];
  salaryRange: {
    min: number | null;
    max: number | null;
  };
  experienceLevel: string[];
  workMode: string[];
  benefits: string[];
  postedDate: string | null;
}

const initialFilters: JobFilters = {
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
};

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

const postedDateOptions = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const JobFilters: React.FC<JobFiltersProps> = ({ onFilterChange, isMobile = false }) => {
  const [filters, setFilters] = useState<JobFilters>(initialFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [localSalaryRange, setLocalSalaryRange] = useState({
    min: initialFilters.salaryRange.min,
    max: initialFilters.salaryRange.max,
  });

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleArrayFilterChange = (key: keyof JobFilters, value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    handleFilterChange(key, newValues);
  };

  const handleSalaryChange = (type: "min" | "max", value: string) => {
    const numValue = value === "" ? null : parseInt(value);
    setLocalSalaryRange(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const applySalaryFilter = () => {
    handleFilterChange("salaryRange", localSalaryRange);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setLocalSalaryRange({
      min: null,
      max: null,
    });
    onFilterChange(initialFilters);
  };

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Location Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Location</h3>
        <div className="mt-2">
          <LocationSelect 
            onLocationChange={(location) => handleFilterChange("location", location)}
            initialValue={filters.location}
          />
        </div>
      </div>

      {/* Job Type Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Job Type</h3>
        <div className="mt-2 space-y-2">
          {jobTypes.map((type) => (
            <div key={type} className="flex items-center">
              <input
                type="checkbox"
                id={`job-type-${type}`}
                checked={filters.jobType.includes(type)}
                onChange={() => handleArrayFilterChange("jobType", type)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`job-type-${type}`}
                className="ml-3 text-sm text-gray-600"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Salary Range</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="min-salary" className="sr-only">
              Minimum Salary
            </label>
            <input
              type="number"
              id="min-salary"
              placeholder="Min"
              value={localSalaryRange.min || ""}
              onChange={(e) => handleSalaryChange("min", e.target.value)}
              onBlur={applySalaryFilter}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <label htmlFor="max-salary" className="sr-only">
              Maximum Salary
            </label>
            <input
              type="number"
              id="max-salary"
              placeholder="Max"
              value={localSalaryRange.max || ""}
              onChange={(e) => handleSalaryChange("max", e.target.value)}
              onBlur={applySalaryFilter}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">Click outside to apply filter</p>
      </div>

      {/* Experience Level Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Experience Level</h3>
        <div className="mt-2 space-y-2">
          {experienceLevels.map((level) => (
            <div key={level} className="flex items-center">
              <input
                type="checkbox"
                id={`experience-${level}`}
                checked={filters.experienceLevel.includes(level)}
                onChange={() => handleArrayFilterChange("experienceLevel", level)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`experience-${level}`}
                className="ml-3 text-sm text-gray-600"
              >
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Work Mode Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Work Mode</h3>
        <div className="mt-2 space-y-2">
          {workModes.map((mode) => (
            <div key={mode} className="flex items-center">
              <input
                type="checkbox"
                id={`work-mode-${mode}`}
                checked={filters.workMode.includes(mode)}
                onChange={() => handleArrayFilterChange("workMode", mode)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`work-mode-${mode}`}
                className="ml-3 text-sm text-gray-600"
              >
                {mode}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Benefits</h3>
        <div className="mt-2 space-y-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center">
              <input
                type="checkbox"
                id={`benefit-${benefit}`}
                checked={filters.benefits.includes(benefit)}
                onChange={() => handleArrayFilterChange("benefits", benefit)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`benefit-${benefit}`}
                className="ml-3 text-sm text-gray-600"
              >
                {benefit}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Posted Date Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Posted Date</h3>
        <div className="mt-2">
          <select
            value={filters.postedDate || ""}
            onChange={(e) => handleFilterChange("postedDate", e.target.value || null)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="">Any time</option>
            {postedDateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div>
        <button
          type="button"
          onClick={clearFilters}
          className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          className="inline-flex items-center gap-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <FunnelIcon className="h-5 w-5" />
          Filters
        </button>

        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white px-4 py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <FilterSection />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </>
    );
  }

  return (
    <div className="w-64 shrink-0">
      <FilterSection />
    </div>
  );
};

export default JobFilters; 