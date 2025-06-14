import { Request, Response, NextFunction } from "express";
import Company from "../models/company-profile/company.model";
import BusinessStream from "../models/company-profile/business_stream.model";
import { ApiError } from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";

export default class CompanyController {
  /**
   * Get all business streams
   */
  public static async getBusinessStreams(req: Request, res: Response, next: NextFunction) {
    try {
      const businessStreams = await BusinessStream.find();
      res.status(200).json(businessStreams);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new company
   */
  public static async createCompany(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('=== Company Creation Request ===');
      console.log('Request body:', req.body);
      console.log('User:', req.user);

      const {
        company_name,
        profile_description,
        business_stream_id,
        establishment_date,
        company_website_url
      } = req.body;

      if (!req.user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User not authenticated");
      }

      // Validate required fields
      if (!company_name || !profile_description || !business_stream_id || !establishment_date || !company_website_url) {
        console.error('Missing required fields:', {
          company_name: !company_name,
          profile_description: !profile_description,
          business_stream_id: !business_stream_id,
          establishment_date: !establishment_date,
          company_website_url: !company_website_url
        });
        throw new ApiError(StatusCodes.BAD_REQUEST, "All fields are required");
      }

      console.log('Validating business stream ID:', business_stream_id);
      // Validate business stream exists
      const businessStream = await BusinessStream.findById(business_stream_id);
      if (!businessStream) {
        console.error('Business stream not found with ID:', business_stream_id);
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid business stream");
      }

      console.log('Creating company with data:', {
        company_name,
        profile_description,
        business_stream_id,
        establishment_date,
        company_website_url
      });

      // Create company
      const company = new Company({
        company_name,
        profile_description,
        business_stream_id,
        establishment_date,
        company_website_url,
        posted_by: (req.user as any)._id
      });

      console.log('Saving company...');
      const savedCompany = await company.save();
      console.log('Company saved successfully:', savedCompany);

      // Ensure we're sending the company ID in the response
      const response = {
        ...savedCompany.toObject(),
        _id: savedCompany._id.toString()
      };
      console.log('Sending response:', response);

      res.status(201).json(response);
    } catch (error) {
      console.error('Error in createCompany:', error);
      next(error);
    }
  }

  /**
   * Get company by ID
   */
  public static async getCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await Company.findById(req.params.id)
        .populate('business_stream_id', 'business_stream_name');

      if (!company) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Company not found");
      }

      res.status(200).json(company);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update company
   */
  public static async updateCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        company_name,
        profile_description,
        business_stream_id,
        establishment_date,
        company_website_url
      } = req.body;

      // Validate business stream exists if provided
      if (business_stream_id) {
        const businessStream = await BusinessStream.findById(business_stream_id);
        if (!businessStream) {
          throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid business stream");
        }
      }

      const company = await Company.findByIdAndUpdate(
        req.params.id,
        {
          company_name,
          profile_description,
          business_stream_id,
          establishment_date,
          company_website_url
        },
        { new: true }
      );

      if (!company) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Company not found");
      }

      res.status(200).json(company);
    } catch (error) {
      next(error);
    }
  }
}
