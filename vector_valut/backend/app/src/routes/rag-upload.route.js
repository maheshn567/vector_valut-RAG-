import { Router } from "express";
import multer from "multer";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createRag,
  getAllRag,
  getRag,
  deleteRag,
} from "../controllers/rag-upload.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Apply verifyJWT middleware to all routes below
router.use(verifyJWT);

// Create / Process a RAG document source (Accepts a multipart file upload, url, or text)
router.post("/create", upload.single("file"), createRag);

// Fetch all documents for the tenant
router.get("/get-all", getAllRag);

// Fetch a single document's metadata
router.post("/get-ragdocs", getRag);

// Delete a document
router.delete("/delete-ragdocs/:id", deleteRag);

export default router;
