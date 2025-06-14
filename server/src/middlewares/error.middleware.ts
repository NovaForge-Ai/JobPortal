import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";
import mongoose from "mongoose";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });

  // Handle Mongoose errors
  if (err instanceof mongoose.Error) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format provided',
        error: err.message
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: err.message
      });
    }
    if (err.name === 'MissingSchemaError') {
      return res.status(500).json({
        success: false,
        message: 'Database configuration error. Please try again later.',
        error: err.message
      });
    }
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.rawErrors
    });
  }

  // Handle other errors
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};
