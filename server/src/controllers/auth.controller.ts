import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import UserAccount from "../models/user/user-account.model";
import UserType from "../models/user/user-type.model";
import { BadRequestError } from "../errors/BadRequestError";
import { ApiError } from "../errors/ApiError";
import { IUserAccount } from "../interfaces/models/user-account/IUserAccount";
import { Document } from "mongoose";
import BusinessStream from "../models/company-profile/business_stream.model";
import Company from "../models/company-profile/company.model";

/**
 * AuthController
 * This class contains methods for handling authentication
 * @class
 *
 * @method login - This method is used to login a user
 * @method signup - This method is used to register a user
 */
export default class AuthController {
  /**
   * This method is used to login a user
   * @param req Request
   * @param res Response
   */
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await UserAccount.findOne({ email: email }).populate({
        path: 'user_type_id',
        select: 'user_type_name'
      });

      // If user account is not found, throw an error
      if (!user) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "User account not found",
          []
        );
      }

      // If user account is found, compare the password
      const isPasswordValid = await (user as any).comparePassword(password);
      if (!isPasswordValid) {
        console.log('Invalid password for user:', email);
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Invalid email or password",
          []
        );
      }

      // Get user type name from populated data
      const userTypeName = (user.user_type_id as any)?.user_type_name;
      if (!userTypeName) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "User type not found",
          []
        );
      }

      // For HR recruiters, find their company
      let companyData = null;
      if (userTypeName === 'hr_recruiter') {
        const Company = (await import('../models/company-profile/company.model')).default;
        console.log('Looking up company for HR recruiter:', user._id);
        const company = await Company.findOne({ posted_by: user._id });
        console.log('Found company:', company);
        if (company) {
          companyData = {
            _id: company._id.toString(),
            company_name: company.company_name
          };
          console.log('Company data to be sent:', companyData);
        } else {
          console.log('No company found for HR recruiter:', user._id);
        }
      }

      // Send a response with the user account details
      const userObject = (user as Document).toObject();
      const response = {
        user: {
          ...userObject,
          user_type_name: userTypeName,
          user_type: userTypeName, // Add user_type for backward compatibility
          company: companyData // Include company data if available
        },
        token: (user as any).generateJWT()
      };

      console.log('Login response:', JSON.stringify(response, null, 2));
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * This method is used to register a user
   * @param req Request
   * @param res Response
   * @param next NextFunction
   */
  public static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const { user_type_name } = payload;

      console.log('Signup request payload:', payload);

      // Find the user type where name [job_seeker, hr_recruiter]
      const userType = await UserType.findOne({
        user_type_name: user_type_name,
      });

      console.log('Found user type:', userType);

      // If user type is not found, throw an error
      if (!userType) {
        throw new BadRequestError(
          `User type '${user_type_name}' not found`,
          []
        );
      }

      // Check if user account exists
      const existingUser = await UserAccount.findOne({
        email: payload.email,
      });

      // If user account exists, throw an error
      if (existingUser) {
        throw new BadRequestError("User account already exists", []);
      }

      // Create a new user account with the user type id and other details
      const userAccount = new UserAccount({
        ...payload,
        user_type_id: userType._id,
        registration_date: new Date(),
      });

      // Save the user account
      await userAccount.save();

      let companyData = null;

      // If user is HR recruiter, create company profile
      if (user_type_name === 'hr_recruiter') {
        console.log('Creating company profile for HR recruiter');
        console.log('Payload:', payload);
        
        const {
          company_name,
          profile_description,
          business_stream,
          establishment_date,
          company_website_url
        } = payload;

        // Validate required company fields
        if (!company_name || !profile_description || !business_stream || !establishment_date || !company_website_url) {
          console.error('Missing required fields:', {
            company_name: !company_name,
            profile_description: !profile_description,
            business_stream: !business_stream,
            establishment_date: !establishment_date,
            company_website_url: !company_website_url
          });
          throw new BadRequestError("All company fields are required for HR recruiters", []);
        }

        // Find business stream by ID
        console.log('Looking up business stream by ID:', business_stream);
        let businessStreamDoc;
        try {
          businessStreamDoc = await BusinessStream.findById(business_stream);
          console.log('Found business stream:', businessStreamDoc);
        } catch (error) {
          console.error('Error finding business stream:', error);
          throw new BadRequestError(`Invalid business stream ID format`, []);
        }

        if (!businessStreamDoc) {
          console.error('Business stream not found with ID:', business_stream);
          // List all available business streams for debugging
          const allStreams = await BusinessStream.find({});
          console.log('Available business streams:', allStreams.map(s => ({ id: s._id, name: s.business_stream_name })));
          throw new BadRequestError(`Business stream not found`, []);
        }

        // Create company
        const company = new Company({
          company_name,
          profile_description,
          business_stream_id: businessStreamDoc._id,
          establishment_date,
          company_website_url,
          posted_by: userAccount._id
        });

        console.log('Creating company with data:', {
          company_name,
          profile_description,
          business_stream_id: businessStreamDoc._id,
          establishment_date,
          company_website_url,
          posted_by: userAccount._id
        });

        // Save company
        const savedCompany = await company.save();
        console.log('Company created successfully:', savedCompany);

        companyData = {
          _id: savedCompany._id.toString(),
          company_name: savedCompany.company_name
        };
      }

      // Send a response with the user account details
      const userObject = (userAccount as Document).toObject();
      const response = {
        success: true,
        message: "User account created successfully",
        user: {
          ...userObject,
          user_type_name: userType.user_type_name,
          user_type: userType.user_type_name, // Add user_type for backward compatibility
          company: companyData // Include company data if available
        }
      };

      console.log('Signup response:', JSON.stringify(response, null, 2));
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      console.error('Signup error:', error);
      next(error);
    }
  }

  /**
   * This method is used to get the current user
   * @param req Request
   * @param res Response
   * @param next NextFunction
   */
  public static async me(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the user account from the request object
      const user = req.user as IUserAccount;
      if (!user) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "User not found",
          []
        );
      }

      // Get user type
      const userType = await UserType.findById(user.user_type_id);
      if (!userType) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "User type not found",
          []
        );
      }

      // Send a response with the user account details
      const response = {
        user: {
          ...user,
          user_type_name: userType.user_type_name,
          user_type: userType.user_type_name // Add user_type for backward compatibility
        }
      };

      console.log('Me response:', JSON.stringify(response, null, 2));
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      throw error;
    }
  }
}
