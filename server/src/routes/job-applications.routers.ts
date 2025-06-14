import { Router } from "express";
import JobApplicationsController from "../controllers/job-applications.controller";
import { asyncWrapper } from "../helpers/async-wrapper";

export default class JobApplicationsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
    console.log('JobApplicationsRoutes initialized with routes:', this.router.stack.map(r => r.route?.path));
  }

  private routes() {
    // Get all applications for a user
    this.router.get(
      "/",
      asyncWrapper(JobApplicationsController.getUserApplications)
    );

    // Apply for a job
    this.router.post(
      "/job/:id/apply",
      asyncWrapper(JobApplicationsController.applyForJob)
    );

    // Get applications for a specific job
    this.router.get(
      "/job/:id",
      asyncWrapper(JobApplicationsController.getJobApplications)
    );

    // Update an application
    this.router.put(
      "/:id",
      asyncWrapper(JobApplicationsController.updateJobApplication)
    );

    // Delete/withdraw an application
    this.router.delete(
      "/:id",
      asyncWrapper(JobApplicationsController.deleteJobApplication)
    );
  }
}
