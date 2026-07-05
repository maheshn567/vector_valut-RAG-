import { Router } from "express";
import multer from "multer";
import { verifyJWT } from "../middleware/auth.middleware.js";
import voiceAssistController from "../controllers/voice-assistant.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Apply verifyJWT middleware to the router
router.use(verifyJWT);

// Define upload field middleware matching req.files.audio used in controller
const uploadFields = upload.fields([{ name: "audio", maxCount: 1 }]);

router.post("/transcribe", uploadFields, voiceAssistController);
router.post("/translation", uploadFields, voiceAssistController);

export default router;