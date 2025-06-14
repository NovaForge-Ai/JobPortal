import { Router } from "express";
import CompanyController from "../controllers/company.controller";
import { asyncWrapper } from "../helpers/async-wrapper";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/business-streams", CompanyController.getBusinessStreams);

// Protected routes
router.post("/companies", authMiddleware, CompanyController.createCompany);
router.get("/companies/:id", authMiddleware, CompanyController.getCompany);
router.put("/companies/:id", authMiddleware, CompanyController.updateCompany);

export default router;
