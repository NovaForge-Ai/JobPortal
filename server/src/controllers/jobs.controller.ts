import { Request, Response, NextFunction } from "express";
import JobPost from "../models/job/job_post.model";
import Company from "../models/company-profile/company.model";
import SavedJob from "../models/job/saved_job.model";
import JobApplication from "../models/job-application.model";
import { IUserAccount } from "../interfaces/models";
import mongoose from "mongoose";
import { ApiError } from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";

/**
 * JobsController
 * This class contains methods for handling jobs
 * @class
 *
 * @method getJobs - This method is used to get list of jobs paginated
 * @method createJob - This method is used to create a job
 * @method getJob - This method is used to get a job details by id
 * @method updateJob - This method is used to update a job
 * @method deleteJob - This method is used to delete a job
 * @method saveJob - This method is used to save a job for a user
 * @method unsaveJob - This method is used to unsave a job for a user
 * @method getSavedJobs - This method is used to get all saved jobs for a user
 */
export default class JobsController {
  /**
   * Get all jobs with pagination and filters
   */
  public static async getJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Get search query if provided
      const search = req.query.search as string;
      const query: any = { is_active: true };

      // Add search condition if search query exists
      if (search) {
        query.$or = [
          { job_name: { $regex: search, $options: 'i' } },
          { job_description: { $regex: search, $options: 'i' } },
          { job_location: { $regex: search, $options: 'i' } }
        ];
      }

      // Add location filter
      if (req.query.location) {
        query.job_location = { $regex: req.query.location, $options: 'i' };
      }

      // Add job type filter
      if (req.query.jobType) {
        const jobTypes = Array.isArray(req.query.jobType) 
          ? req.query.jobType 
          : [req.query.jobType];
        query.job_type = { $in: jobTypes };
      }

      // Add salary range filter
      if (req.query.minSalary || req.query.maxSalary) {
        query.salary = {};
        if (req.query.minSalary) {
          query.salary.$gte = parseInt(req.query.minSalary as string);
        }
        if (req.query.maxSalary) {
          query.salary.$lte = parseInt(req.query.maxSalary as string);
        }
      }

      // Add experience level filter
      if (req.query.experienceLevel) {
        const experienceLevels = Array.isArray(req.query.experienceLevel)
          ? req.query.experienceLevel
          : [req.query.experienceLevel];
        query.experience_level = { $in: experienceLevels };
      }

      // Add work mode filter
      if (req.query.workMode) {
        const workModes = Array.isArray(req.query.workMode)
          ? req.query.workMode
          : [req.query.workMode];
        query.work_mode = { $in: workModes };
      }

      // Add benefits filter
      if (req.query.benefits) {
        const benefits = Array.isArray(req.query.benefits)
          ? req.query.benefits
          : [req.query.benefits];
        query.benefits = { $all: benefits };
      }

      // Add posted date filter
      if (req.query.postedDate) {
        const now = new Date();
        let dateFilter: Date;

        switch (req.query.postedDate) {
          case '24h':
            dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '90d':
            dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          default:
            dateFilter = new Date(0); // Beginning of time
        }

        query.created_date = { $gte: dateFilter };
      }

      // If the endpoint is /jobs/company, filter by the logged-in user's company
      if (req.originalUrl.includes('/jobs/company')) {
        if (!req.user) {
          throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "User not authenticated"
          );
        }
        const user = req.user as IUserAccount;
        query.posted_by = user._id;
      }

      // If user is authenticated and is a job seeker, exclude jobs they've already applied for
      if (req.user && (req.user as IUserAccount).user_type_id === 'job_seeker') {
        const user = req.user as IUserAccount;
        const appliedJobs = await JobApplication.find({ user_id: user._id }).select('job_id');
        const appliedJobIds = appliedJobs.map(app => app.job_id);
        query._id = { $nin: appliedJobIds };
      }

      console.log('Fetching jobs with query:', query);

      // First, ensure the Company model is registered
      if (!mongoose.models.Company) {
        console.error('Company model not registered');
        throw new Error('Database configuration error');
      }

      const jobs = await JobPost.find(query)
        .sort({ created_date: -1 })
        .skip(skip)
        .limit(limit)
        .populate('posted_by', 'email')
        .populate({
          path: 'company_id',
          select: 'company_name',
          model: 'Company'
        });

      console.log('Jobs fetched successfully:', jobs.length);
      
      // Log jobs with missing company information
      const jobsWithMissingCompany = jobs.filter(job => !job.company_id);
      if (jobsWithMissingCompany.length > 0) {
        console.warn('Found jobs with missing company information:', jobsWithMissingCompany.map(job => ({
          job_id: job._id,
          job_name: job.job_name
        })));
      }

      const total = await JobPost.countDocuments(query);

      res.status(200).json({
        jobs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error in getJobs:', error);
      next(error);
    }
  }

  /**
   * This method is used to create a job
   * @param req Request
   * @param res Response
   */
  public static async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('=== Job Creation Request ===');
      console.log('Headers:', req.headers);
      console.log('Body:', req.body);
      console.log('User:', req.user);

      const {
        job_name,
        job_description,
        job_location,
        job_type,
        salary,
        experience_level,
        work_mode,
        benefits,
        requirements,
        required_qualifications,
        companyId
      } = req.body;

      if (!req.user) {
        console.error('No user found in request');
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!companyId) {
        console.error('No company ID provided');
        return res.status(400).json({ message: "Company ID is required" });
      }

      console.log('Looking up company with ID:', companyId);
      // Verify company exists
      const company = await Company.findById(companyId);
      if (!company) {
        console.error('Company not found with ID:', companyId);
        // List all companies in the database for debugging
        const allCompanies = await Company.find();
        console.log('Available companies:', allCompanies.map(c => ({ id: c._id, name: c.company_name })));
        return res.status(404).json({ message: "Company not found" });
      }

      console.log('Found company:', company.company_name);
      const user = req.user as IUserAccount;
      console.log('User ID:', user._id);

      const jobPost = new JobPost({
        job_name,
        job_description,
        job_location,
        job_type,
        salary: parseInt(salary),
        experience_level,
        work_mode,
        benefits,
        requirements,
        required_qualifications,
        company_id: companyId,
        posted_by: user._id,
        is_company_name_hidden: false,
        created_date: new Date(),
        is_active: true
      });

      console.log('Job post object created:', jobPost);
      await jobPost.save();
      console.log('Job saved successfully');
      res.status(201).json(jobPost);
    } catch (error) {
      console.error('Error creating job:', error);
      next(error);
    }
  }

  /**
   * This method is used to get a job details by id
   * @param req Request
   * @param res Response
   */
  public static async getJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const job = await JobPost.findById(id)
        .populate('posted_by', 'email')
        .populate({
          path: 'company_id',
          select: 'company_name',
          model: 'Company'
        });

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.status(200).json(job);
    } catch (error) {
      next(error);
    }
  }

  /**
   * This method is used to update a job
   * @param req Request
   * @param res Response
   */
  public static async updateJob(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // TODO: Not implemented yet
    res.status(200).send(`⚡️[Server]: JobsController updateJob!`);
  }

  /**
   * This method is used to delete a job
   * @param req Request
   * @param res Response
   */
  public static async deleteJob(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // TODO: Not implemented yet
    res.status(200).send(`⚡️[Server]: JobsController deleteJob!`);
  }

  /**
   * Save a job for a user
   */
  public static async saveJob(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const user = req.user as IUserAccount;
      const { jobId } = req.params;

      // Check if job exists
      const job = await JobPost.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      // Create saved job entry
      const savedJob = new SavedJob({
        user_id: user._id,
        job_id: jobId,
      });

      await savedJob.save();
      res.status(201).json(savedJob);
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key error - job already saved
        return res.status(400).json({ message: 'Job already saved' });
      }
      next(error);
    }
  }

  /**
   * Unsave a job for a user
   */
  public static async unsaveJob(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const user = req.user as IUserAccount;
      const { jobId } = req.params;

      const result = await SavedJob.deleteOne({
        user_id: user._id,
        job_id: jobId,
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Saved job not found' });
      }

      res.status(200).json({ message: 'Job unsaved successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all saved jobs for a user
   */
  public static async getSavedJobs(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const user = req.user as IUserAccount;

      const savedJobs = await SavedJob.find({ user_id: user._id })
        .populate({
          path: 'job_id',
          populate: {
            path: 'company_id',
            select: 'company_name',
          },
        })
        .sort({ saved_date: -1 });

      res.status(200).json({ saved_jobs: savedJobs });
    } catch (error) {
      next(error);
    }
  }
}
