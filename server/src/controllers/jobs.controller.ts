import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import JobPost from "models/job-post.model";
import Company from "models/company-profile/company.model";
import SavedJob from "../models/job/saved_job.model";
import JobApplication, { IJobApplication } from "models/job-application.model";
import UserAccount from "models/user/user-account.model";
import { ApiError } from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { CompanySchema } from '../models/company-profile/company.model';

interface IUserAccountWithType extends mongoose.Document {
  user_type_name: string;
  _id: mongoose.Types.ObjectId;
  email: string;
  user_type_id: mongoose.Types.ObjectId;
}

interface AuthenticatedRequest extends Request {
  user?: IUserAccountWithType;
}

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
  public static async getJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      console.log('=== getJobs Request ===');
      console.log('Full Request:', {
        headers: req.headers,
        user: req.user,
        query: req.query
      });

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Build query based on request parameters
      const query: any = { is_active: true };

      // Add search query if provided
      if (req.query.search) {
        query.$or = [
          { job_name: { $regex: req.query.search, $options: 'i' } },
          { job_description: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      // Add filters if provided
      if (req.query.job_type) query.job_type = req.query.job_type;
      if (req.query.location) query.location = req.query.location;
      if (req.query.salary_min) query.salary_min = { $gte: parseInt(req.query.salary_min as string) };
      if (req.query.salary_max) query.salary_max = { $lte: parseInt(req.query.salary_max as string) };
      if (req.query.experience_level) query.experience_level = req.query.experience_level;
      if (req.query.work_mode) query.work_mode = req.query.work_mode;
      if (req.query.posted_date) {
        const date = new Date(req.query.posted_date as string);
        query.createdAt = { $gte: date };
      }

      // Check if user is authenticated and is a job seeker
      let appliedJobs: IJobApplication[] = [];
      console.log('=== User Authentication Check ===');
      console.log('User object:', req.user);
      console.log('User type name:', req.user?.user_type_name);
      console.log('Is user authenticated:', !!req.user);
      console.log('Is user a job seeker:', req.user?.user_type_name === 'job_seeker');

      if (req.user && req.user.user_type_name === 'job_seeker') {
        console.log('=== User is Job Seeker ===');
        console.log('User ID:', req.user._id);
        console.log('User Type:', req.user.user_type_name);
        
        // Fetch applied jobs
        appliedJobs = await JobApplication.find({ user_id: req.user._id }).select('job_id');
        console.log('Applied Jobs:', appliedJobs);
        
        if (appliedJobs.length > 0) {
          const appliedJobIds = appliedJobs.map(job => job.job_id);
          console.log('Applied Job IDs:', appliedJobIds);
          
          // Update query to exclude applied jobs
          query._id = { $nin: appliedJobIds };
          console.log('Updated Query:', query);
        }
      } else {
        console.log('=== User is not Job Seeker or not authenticated ===');
        console.log('User:', req.user);
      }

      // Ensure Company model is registered
      if (!mongoose.models.Company) {
        console.log('Registering Company model');
        mongoose.model('Company', Company.schema);
      }

      // Fetch jobs with pagination
      const jobs = await JobPost.find(query)
        .skip(skip)
        .limit(limit)
        .populate('company_id', 'company_name')
        .populate('posted_by', 'email')
        .sort({ createdAt: -1 });

      // Log jobs with missing company information
      jobs.forEach(job => {
        if (!job.company_id) {
          console.log('Job with missing company:', job._id);
        }
      });

      const total = await JobPost.countDocuments(query);

      // If user is authenticated and is a job seeker, add is_applied field
      let jobsWithAppliedStatus = jobs;
      if (req.user && req.user.user_type_name === 'job_seeker') {
        // Use the same appliedJobs array we fetched earlier
        const appliedJobIds = appliedJobs.map((job: IJobApplication) => job.job_id.toString());
        
        // Add is_applied field to each job
        jobsWithAppliedStatus = jobs.map(job => {
          const jobObj = job.toObject();
          const isApplied = appliedJobIds.includes(job._id.toString());
          console.log(`Job ${job._id}: is_applied = ${isApplied}`);
          return {
            ...jobObj,
            is_applied: isApplied
          } as any;
        });
      } else {
        // For non-job seekers or unauthenticated users, set is_applied to false
        jobsWithAppliedStatus = jobs.map(job => ({
          ...job.toObject(),
          is_applied: false
        } as any));
      }

      console.log('=== Query Results ===');
      console.log('Total Jobs:', total);
      console.log('Jobs Found:', jobs.length);
      console.log('Query Used:', JSON.stringify(query, null, 2));
      console.log('First job with applied status:', jobsWithAppliedStatus[0]);

      res.json({
        jobs: jobsWithAppliedStatus,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error: any) {
      console.error('Error in getJobs:', error);
      res.status(500).json({ message: 'Error fetching jobs', error: error.message });
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
      const user = req.user as UserAccount;
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
      const user = req.user as UserAccount;
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
      const user = req.user as UserAccount;
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
      const user = req.user as UserAccount;

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
