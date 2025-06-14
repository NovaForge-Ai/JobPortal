import { Application, Request, Response, NextFunction } from "express";
import UsersRoutes from "./users.routes";
import JobsRoutes from "./jobs.routes";
import JobApplicationsRoutes from "./job-applications.routers";
import AuthRoutes from "./auth.routes";
import companyRoutes from "./company.routes";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../errors/ApiError";
import { authMiddleware } from "../middlewares/auth.middleware";

export default class Routes {
  constructor(app: Application) {
    console.log('Initializing routes...');
    
    app.use("/api/v1/auth", new AuthRoutes().router);
    console.log('Auth routes registered');
    
    // Jobs routes
    app.use("/api/v1/jobs", new JobsRoutes().router);
    console.log('Jobs routes registered');
    
    // Company routes
    app.use("/api/v1", companyRoutes);
    console.log('Company routes registered');
    
    // User routes
    app.use("/api/v1/users", authMiddleware, new UsersRoutes().router);
    console.log('User routes registered');
    
    // Job applications routes
    app.use("/api/v1/applications", authMiddleware, new JobApplicationsRoutes().router);
    console.log('Job applications routes registered');

    app.get("/", (req: Request, res: Response) => {
      res.status(StatusCodes.OK).send(`⚡️[Server]: Server is running!`);
    });

    app.get("/health", (req: Request, res: Response) => {
      res.status(StatusCodes.OK).send(`⚡️[Server]: Server is running!`);
    });

    app.use("*", (req: Request, res: Response, next: NextFunction) => {
      console.log('Route not found:', req.originalUrl);
      const error = new ApiError(
        StatusCodes.NOT_FOUND,
        `🔍[Server]: Route not found: ${req.originalUrl}`
      );
      next(error);
    });
  }
}
