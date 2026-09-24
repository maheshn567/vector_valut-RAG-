import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  tenantRegister,
  tenantLogin,
} from "../controllers/tenant-auth.controller.js";
import {
  getTenantController,
  updateTenantController,
} from "../controllers/tenant.controller.js";

const router = Router();

// ==========================================
// Public Auth Routes (No Token Required)
// ==========================================
router.post("/register", tenantRegister);
router.post("/login", tenantLogin);

// ==========================================
// Private Admin Routes (Requires JWT Token)
// ==========================================
router.use(verifyJWT);

// Fetch details of the authenticated tenant (uses req.tenantId from verifyJWT)
router.get("/get-tenant", getTenantController);

// Update details of the authenticated tenant (uses req.tenantId from verifyJWT)
router.patch("/update-tenant", updateTenantController);

export default router;
