import { Router } from "express";
import { verifyApiKey } from "../middleware/auth.middleware.js";
import { cunkRetreival, getContextById } from "../controllers/retrieval.controller.js";
import { generateAnswer } from "../controllers/generate.controller.js";

const router = Router();

// Programmatic retrieval and RAG endpoints, secured using App specific API key
router.post("/retrieve", verifyApiKey, cunkRetreival);
router.post("/context", verifyApiKey, getContextById);
router.post("/ask", verifyApiKey, generateAnswer);

export default router;
