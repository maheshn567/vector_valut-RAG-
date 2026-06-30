import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createAppController,
  getAppController,
  getTenantAppsController,
  updateAppController,
} from "../controllers/app.controller.js";

const router = Router();

// Apply verifyJWT middleware to all routes below
router.use(verifyJWT);

// Create a new app for the authenticated tenant
router.post("/create", createAppController);

// Fetch details of a single app (tenant ownership verified in controller)
router.post("/get-app", getAppController);

// Fetch all apps belonging to the authenticated tenant
router.get("/tenant-apps", getTenantAppsController);

// Update details of a specific app (tenant ownership verified in controller)
router.patch("/update-app/:id", updateAppController);

export default router;
