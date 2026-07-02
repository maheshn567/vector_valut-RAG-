import { Router } from "express";
import googleAuth from "../controllers/googleAuth.controller.js";

const router = Router();

// Route all sub-paths and HTTP methods to the Better-Auth handler
router.use(googleAuth);

export default router;