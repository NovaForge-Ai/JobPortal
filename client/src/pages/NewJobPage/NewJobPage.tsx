import { useState } from "react";
import {
  BriefcaseIcon,
  CurrencyDollarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Divider from "@/components/core-ui/Divider";
import PortalLayout from "@/components/layouts/portal/PortalLayout";

const NewJobPage = () => {
  // State to manage form data
  const [jobName, setJobName] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [salary, setSalary] = useState("");
  const [experienceRequired, setExperienceRequired] = useState("");
  const [location, setLocation] = useState("");
  const [visaProvided, setVisaProvided] = useState<"yes" | "no" | "">("");
  const [ticketProvided, setTicketProvided] = useState<"yes" | "no" | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this data to your backend API
    console.log("New Job Details:", {
      jobName,
      qualifications,
      salary,
      experienceRequired,
      location,
      visaProvided,
      ticketProvided,
    });
    // Reset form fields after submission
    setJobName("");
    setQualifications("");
    setSalary("");
    setExperienceRequired("");
    setLocation("");
    setVisaProvided("");
    setTicketProvided("");
    alert("Job submitted successfully! (Check console for data)"); // Simple alert for demonstration
  };

  return (
    <PortalLayout title="Post New Job">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Post a New Job</h1>

        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Name */}
            <div>
              <label
                htmlFor="jobName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Job Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="jobName"
                  id="jobName"
                  required
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <label
                htmlFor="qualifications"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Qualifications (Comma-separated)
              </label>
              <div className="mt-2">
                <textarea
                  id="qualifications"
                  name="qualifications"
                  rows={3}
                  required
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="e.g., Bachelor's degree in CS, 5+ years React, Node.js"
                ></textarea>
              </div>
            </div>

            {/* Salary */}
            <div>
              <label
                htmlFor="salary"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Salary (e.g., $80k - $100k/yr)
              </label>
              <div className="mt-2 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="$XXk - $XXk/yr"
                />
              </div>
            </div>

            {/* Experience Required */}
            <div>
              <label
                htmlFor="experienceRequired"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Experience Required (e.g., 3-5 years)
              </label>
              <div className="mt-2 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="experienceRequired"
                  id="experienceRequired"
                  required
                  value={experienceRequired}
                  onChange={(e) => setExperienceRequired(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="e.g., 3-5 years"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Location
              </label>
              <div className="mt-2 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="e.g., Remote, New York, NY"
                />
              </div>
            </div>

            <Divider />

            {/* Visa Provided by employer */}
            <div>
              <h5 className="text-sm font-medium leading-6 text-gray-900 mb-2">
                Visa Provided by Employer?
              </h5>
              <div className="flex gap-x-6">
                <div className="flex items-center">
                  <input
                    id="visa-yes"
                    name="visaProvided"
                    type="radio"
                    value="yes"
                    checked={visaProvided === "yes"}
                    onChange={(e) =>
                      setVisaProvided(e.target.value as "yes" | "no")
                    }
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="visa-yes"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="visa-no"
                    name="visaProvided"
                    type="radio"
                    value="no"
                    checked={visaProvided === "no"}
                    onChange={(e) =>
                      setVisaProvided(e.target.value as "yes" | "no")
                    }
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="visa-no"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Ticket Provided by employer */}
            <div>
              <h5 className="text-sm font-medium leading-6 text-gray-900 mb-2">
                Ticket Provided by Employer?
              </h5>
              <div className="flex gap-x-6">
                <div className="flex items-center">
                  <input
                    id="ticket-yes"
                    name="ticketProvided"
                    type="radio"
                    value="yes"
                    checked={ticketProvided === "yes"}
                    onChange={(e) =>
                      setTicketProvided(e.target.value as "yes" | "no")
                    }
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="ticket-yes"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="ticket-no"
                    name="ticketProvided"
                    type="radio"
                    value="no"
                    checked={ticketProvided === "no"}
                    onChange={(e) =>
                      setTicketProvided(e.target.value as "yes" | "no")
                    }
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="ticket-no"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-5">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      </main>
    </PortalLayout>
  );
};

export default NewJobPage;