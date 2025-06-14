import { Request, Response, NextFunction } from "express";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export default class RequestValidator {
  static validate = <T extends object>(classInstance: ClassConstructor<T>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const convertedObject = plainToInstance(classInstance, req.body);
        const errors = await validate(convertedObject);
        
        if (errors.length > 0) {
          let rawErrors: string[] = [];
          for (const error of errors) {
            rawErrors = rawErrors.concat(
              ...rawErrors,
              Object.values(error.constraints ?? [])
            );
          }

          const message = "Request validation error";
          console.log(`❌ [RequestValidator.Error]`, rawErrors);
          return res.status(400).json({ 
            success: false,
            message, 
            errors: rawErrors 
          });
        }

        // If validation passes, attach the validated object to the request
        req.body = convertedObject;
        next();
      } catch (error: any) {
        console.error('Validation error:', error);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: [error.message]
        });
      }
    };
  };
}
