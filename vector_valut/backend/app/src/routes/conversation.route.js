import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createConversation,
  getConversation,
  listConversations,
  appendMessage,
  deleteConversation,
} from "../controllers/conversation.controller.js";

const router = Router();

// Secure all conversation endpoints under JWT authorization
router.use(verifyJWT);

router.post("/", createConversation);
router.get("/user/:userId", listConversations);
router.get("/:conversationId", getConversation);
router.post("/:conversationId/message", appendMessage);
router.delete("/:conversationId", deleteConversation);

export default router;
