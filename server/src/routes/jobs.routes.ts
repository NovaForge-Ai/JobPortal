import { Router } from "express";
import JobsController from "../controllers/jobs.controller";
import { asyncWrapper } from "../helpers/async-wrapper";
import { authMiddleware } from "../middlewares/auth.middleware";

export default class JobsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    // Public routes
    this.router.get("/", asyncWrapper(JobsController.getJobs));
    
    // Protected routes without ID - must be before special routes
    this.router.post("/", authMiddleware, asyncWrapper(JobsController.createJob));
    
    // Special routes - must be before /:id routes
    this.router.get("/company", authMiddleware, asyncWrapper(JobsController.getJobs));
    this.router.get("/saved", authMiddleware, asyncWrapper(JobsController.getSavedJobs));
    this.router.post("/:jobId/save", authMiddleware, asyncWrapper(JobsController.saveJob));
    this.router.delete("/:jobId/save", authMiddleware, asyncWrapper(JobsController.unsaveJob));
    
    // Protected routes with ID
    this.router.get("/:id", asyncWrapper(JobsController.getJob));
    this.router.put("/:id", authMiddleware, asyncWrapper(JobsController.updateJob));
    this.router.delete("/:id", authMiddleware, asyncWrapper(JobsController.deleteJob));
  }
}
