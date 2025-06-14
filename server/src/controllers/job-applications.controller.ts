import { Request, Response, NextFunction } from "express";
import JobApplication from "../models/job-application.model";
import { IUserAccount } from "../interfaces/models";
import { ApiError } from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import UserType from "../models/user/user-type.model";

/**
 * JobApplicationsController
 * This class contains methods for handling job applications
 * @class
 *
 * @method applyForJob - This method is used to apply for a job
 * @method getJobApplications - This method is used to get list of job applications paginated
 */
export default class JobApplicationsController {
  /**
   * This method is used to apply for a job
   * @param req Request
   * @param res Response
   */
  public static async applyForJob(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: jobId } = req.params;
      const user = req.user as IUserAccount;

      // Check if user has already applied for this job
      const existingApplication = await JobApplication.findOne({
        job_id: jobId,
        user_id: user._id,
      });

      if (existingApplication) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "You have already applied for this job"
        );
      }

      // Create new application
      const application = new JobApplication({
        job_id: jobId,
        user_id: user._id,
        status: "pending",
        applied_date: new Date(),
      });

      await application.save();

      res.status(StatusCodes.CREATED).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * This method is used to get list of a job applications paginated
   * @param req Request
   * @param res Response
   */
  public static async getJobApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: jobId } = req.params;
      const { page = 1, limit = 10, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const query: any = { job_id: jobId };
      if (status) {
        query.status = status;
      }

      const applications = await JobApplication.find(query)
        .sort({ applied_date: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("user_id", "first_name last_name email")
        .populate({
          path: "job_id",
          select: "job_name company_id",
          populate: {
            path: "company_id",
            select: "company_name",
          },
        });

      const total = await JobApplication.countDocuments(query);

      res.status(StatusCodes.OK).json({
        applications,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * This method is used to get list of a user [recruiter or job seeker] applications paginated
   * @param req Request
   * @param res Response
   */
  public static async getUserApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user as IUserAccount;
      const { page = 1, limit = 10, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const query: any = { user_id: user._id };
      if (status) {
        query.status = status;
      }

      const applications = await JobApplication.find(query)
        .sort({ applied_date: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate({
          path: "job_id",
          select: "job_name company_id job_location salary",
          populate: {
            path: "company_id",
            select: "company_name",
          },
        });

      const total = await JobApplication.countDocuments(query);

      res.status(StatusCodes.OK).json({
        applications,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * This method is used to update a job application
   * [Job seeker can update their application status, recruiter can do everything]
   *
   * @param req Request
   * @param res Response
   */
  public static async updateJobApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: applicationId } = req.params;
      const { status } = req.body;
      const user = req.user as IUserAccount;

      const application = await JobApplication.findById(applicationId);

      if (!application) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Application not found"
        );
      }

      // Get user type
      const userType = await UserType.findById(user.user_type_id);
      if (!userType) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Invalid user type"
        );
      }

      // Check if user is authorized to update this application
      if (
        application.user_id.toString() !== user._id.toString() &&
        userType.user_type_name !== "hr_recruiter"
      ) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "You are not authorized to update this application"
        );
      }

      application.status = status;
      await application.save();

      res.status(StatusCodes.OK).json({
        message: "Application updated successfully",
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * This method is used to delete a job application
   * @param req Request
   * @param res Response
   */
  public static async deleteJobApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: applicationId } = req.params;
      const user = req.user as IUserAccount;

      const application = await JobApplication.findById(applicationId);

      if (!application) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Application not found"
        );
      }

      // Get user type
      const userType = await UserType.findById(user.user_type_id);
      if (!userType) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Invalid user type"
        );
      }

      // Check if user is authorized to delete this application
      if (
        application.user_id.toString() !== user._id.toString() &&
        userType.user_type_name !== "hr_recruiter"
      ) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "You are not authorized to delete this application"
        );
      }

      // Only allow deletion if the application is in pending status
      if (application.status !== "pending") {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Cannot delete application. Only pending applications can be deleted."
        );
      }

      await application.deleteOne();

      res.status(StatusCodes.OK).json({
        message: "Application deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}
