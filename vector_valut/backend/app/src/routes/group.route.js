import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createGroupController,
  getGroupController,
  getAppGroupsController,
  updateGroupController,
  deleteGroupController,
} from "../controllers/group.controller.js";

const router = Router();

// Apply verifyJWT middleware to all routes below
router.use(verifyJWT);

// Create a new Group (corpus) under an App
router.post("/create", createGroupController);

// Fetch a single Group's details
router.post("/get-group", getGroupController);

// Fetch all Groups belonging to a specific App
router.post("/app-groups", getAppGroupsController);

// Update a Group
router.patch("/update-group/:id", updateGroupController);

// Delete a Group
router.delete("/delete-group/:id", deleteGroupController);

export default router;
