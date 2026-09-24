import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { cunkRetreival, getContextById } from "../controllers/retrieval.controller.js";
import { generateAnswer } from "../controllers/generate.controller.js";

const router = Router();

// Retrieval and RAG endpoints, secured using standard User JWT Session
router.post("/retrieve", verifyJWT, cunkRetreival);
router.post("/context", verifyJWT, getContextById);
router.post("/ask", verifyJWT, generateAnswer);

export default router;
