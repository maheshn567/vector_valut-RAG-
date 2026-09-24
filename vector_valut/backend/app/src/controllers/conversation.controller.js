import prisma from "../../../prisma/index.js";
import { createConversationSchema, appendMessageSchema } from "../validation/conversation.validation.js";

/**
 * Create a new conversation thread
 */
export async function createConversation(req, res) {
  const result = createConversationSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    });
  }

  const tenantId = req.tenantId;
  const { appId, userId, metadata } = result.data;

  try {
    // Verify App belongs to Tenant
    const app = await prisma.app.findFirst({
      where: { appId, tenantId },
    });
    if (!app) {
      return res.status(404).json({ success: false, message: "App not found" });
    }

    const conversation = await prisma.conversation.create({
      data: {
        tenantId,
        appId,
        userId,
        messages: [],
        metadata: metadata || {},
      },
    });

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      data: conversation,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create conversation",
      error: error.message,
    });
  }
}

/**
 * Retrieve a conversation's history by its ID
 */
export async function getConversation(req, res) {
  const { conversationId } = req.params;
  const tenantId = req.tenantId;

  try {
    const conversation = await prisma.conversation.findFirst({
      where: { conversationId, tenantId },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation history retrieved successfully",
      data: conversation,
    });
  } catch (error) {
    console.error("Error retrieving conversation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve conversation history",
      error: error.message,
    });
  }
}

/**
 * List all conversations for a specific user
 */
export async function listConversations(req, res) {
  const { userId } = req.params;
  const tenantId = req.tenantId;

  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId, tenantId },
      orderBy: { updatedAt: "desc" },
      select: {
        conversationId: true,
        appId: true,
        userId: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        // Don't select the full messages payload to keep listing payload lightweight
      },
    });

    return res.status(200).json({
      success: true,
      message: "Conversations list retrieved successfully",
      data: conversations,
    });
  } catch (error) {
    console.error("Error listing conversations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to list conversations",
      error: error.message,
    });
  }
}

/**
 * Append a single message turn manually to a conversation history
 */
export async function appendMessage(req, res) {
  const { conversationId } = req.params;
  const tenantId = req.tenantId;

  const result = appendMessageSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    });
  }

  const { role, content, citations } = result.data;

  try {
    const conversation = await prisma.conversation.findFirst({
      where: { conversationId, tenantId },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const currentMessages = Array.isArray(conversation.messages) ? conversation.messages : [];
    const newMessage = {
      role,
      content,
      citations: citations || [],
      timestamp: new Date(),
    };

    const updatedMessages = [...currentMessages, newMessage];

    const updatedConversation = await prisma.conversation.update({
      where: { conversationId },
      data: {
        messages: updatedMessages,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Message appended successfully",
      data: updatedConversation,
    });
  } catch (error) {
    console.error("Error appending message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to append message",
      error: error.message,
    });
  }
}

/**
 * Delete a conversation thread
 */
export async function deleteConversation(req, res) {
  const { conversationId } = req.params;
  const tenantId = req.tenantId;

  try {
    const conversation = await prisma.conversation.findFirst({
      where: { conversationId, tenantId },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or unauthorized",
      });
    }

    await prisma.conversation.delete({
      where: { conversationId },
    });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
      error: error.message,
    });
  }
}
