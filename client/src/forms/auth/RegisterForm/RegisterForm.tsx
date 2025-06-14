import { EyeIcon } from "@heroicons/react/24/outline";
import useRegisterForm from "./useRegisterForm";
import TermsAndConditionsDialog from "@/components/dialogs/TermsAndConditionsDialog";
import FieldError from "@/components/core-ui/FieldError";
import Alert from "@/components/core-ui/Alert";
import { useEffect, useState } from "react";
import HttpService from "@/core/http.service";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const httpService = HttpService.getInstance();

const RegisterForm = () => {
  const {
    form,
    registerSuccessMessage,
    registerErrorMessage,
    termsConditionsModalOpen,
    handleOnOpenTermsConditionsModal,
    handleOnCloseTermsConditionsModal,
  } = useRegisterForm();

  const [businessStreams, setBusinessStreams] = useState<Array<{ _id: string; business_stream_name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBusinessStreams = async () => {
      try {
        setIsLoading(true);
        const response = await httpService.get('/business-streams');
        setBusinessStreams(response.data);
      } catch (error) {
        console.error('Error fetching business streams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (form.values.user_type_name === "hr_recruiter") {
      fetchBusinessStreams();
    }
  }, [form.values.user_type_name]);

  const isCompanyRegistration = form.values.user_type_name === "hr_recruiter";
  const isJobSeekerRegistration = form.values.user_type_name === "job_seeker";

  return (
    <>
      {registerErrorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{registerErrorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {registerSuccessMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{registerSuccessMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="user_type_name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            I am a
            <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <select
              id="user_type_name"
              name="user_type_name"
              required
              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={form.values.user_type_name}
              disabled={form.isSubmitting}
              onChange={form.handleChange}
            >
              <option value="job_seeker">Job Seeker</option>
              <option value="hr_recruiter">HR Recruiter</option>
            </select>
            {form.errors.user_type_name && (
              <FieldError error={form.errors.user_type_name} />
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email
            <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={form.values.email}
              disabled={form.isSubmitting}
              onChange={form.handleChange}
              placeholder="Enter your email"
            />
            {form.errors.email && <FieldError error={form.errors.email} />}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Password
            <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={form.values.password}
              disabled={form.isSubmitting}
              onChange={form.handleChange}
              placeholder="Enter your password"
            />
            {form.errors.password && (
              <FieldError error={form.errors.password} />
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Confirm Password
            <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={form.values.confirmPassword}
              disabled={form.isSubmitting}
              onChange={form.handleChange}
              placeholder="Confirm your password"
            />
            {form.errors.confirmPassword && (
              <FieldError error={form.errors.confirmPassword} />
            )}
          </div>
        </div>

        {isJobSeekerRegistration && (
          <>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.values.phone}
                  disabled={form.isSubmitting}
                  onChange={form.handleChange}
                  placeholder="Enter your phone number"
                />
                {form.errors.phone && <FieldError error={form.errors.phone} />}
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.values.address}
                  disabled={form.isSubmitting}
                  onChange={form.handleChange}
                  placeholder="Enter your address"
                />
                {form.errors.address && <FieldError error={form.errors.address} />}
              </div>
            </div>
          </>
        )}

        {isCompanyRegistration && (
          <>
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Name
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.values.company_name}
                  disabled={form.isSubmitting}
                  onChange={form.handleChange}
                  placeholder="Enter your company name"
                />
                {form.errors.company_name && (
                  <FieldError error={form.errors.company_name} />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="business_stream"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Business Stream
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="business_stream"
                  name="business_stream"
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.values.business_stream}
                  disabled={form.isSubmitting || isLoading}
                  onChange={form.handleChange}
                >
                  <option value="">Select a business stream</option>
                  {businessStreams.map((stream) => (
                    <option key={stream._id} value={stream.business_stream_name}>
                      {stream.business_stream_name}
                    </option>
                  ))}
                </select>
                {form.errors.business_stream && (
                  <FieldError error={form.errors.business_stream} />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="company_website_url"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Website
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="company_website_url"
                  name="company_website_url"
                  type="url"
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.values.company_website_url}
                  disabled={form.isSubmitting}
                  onChange={form.handleChange}
                  placeholder="https://www.example.com"
                />
                {form.errors.company_website_url && (
                  <FieldError error={form.errors.company_website_url} />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="establishment_date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Establishment Date
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="establishment_date"
                  name="establishment_date"
                  type="date"
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.values.establishment_date}
                  disabled={form.isSubmitting}
                  onChange={form.handleChange}
                />
                {form.errors.establishment_date && (
                  <FieldError error={form.errors.establishment_date} />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="profile_description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Profile Description
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <textarea
                  id="profile_description"
                  name="profile_description"
                  rows={4}
                  required
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.values.profile_description}
                  disabled={form.isSubmitting}
                  onChange={form.handleChange}
                  placeholder="Describe your company, its mission, values, and culture"
                />
                {form.errors.profile_description && (
                  <FieldError error={form.errors.profile_description} />
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex items-center">
          <input
            id="termsConditions"
            name="termsConditions"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            checked={form.values.termsConditions}
            disabled={form.isSubmitting}
            onChange={form.handleChange}
          />
          <label
            htmlFor="termsConditions"
            className="ml-2 block text-sm text-gray-900"
          >
            I agree to the{" "}
            <button
              type="button"
              onClick={handleOnOpenTermsConditionsModal}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Terms and Conditions
            </button>
            <span className="text-red-500">*</span>
          </label>
        </div>
        {form.errors.termsConditions && (
          <FieldError error={form.errors.termsConditions} />
        )}

        <div>
          <button
            type="submit"
            disabled={form.isSubmitting}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {form.isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>
      </form>

      <TermsAndConditionsDialog
        open={termsConditionsModalOpen}
        onClose={handleOnCloseTermsConditionsModal}
      />
    </>
  );
};

export default RegisterForm;
