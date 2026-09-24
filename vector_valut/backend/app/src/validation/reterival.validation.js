import { z } from "zod";

// 1. Shared validator for the user prompt text parameter
const userPromptField = z.string().min(1, "User prompt cannot be empty").max(2000, "User prompt cannot exceed 2000 characters");

const baseRAGSchema = z.object({
  appId: z.string().uuid("Invalid App ID format").optional(),
  groupId: z.string().uuid("Invalid Group ID format").optional(),
  docId: z.string().uuid("Invalid Document ID format").optional(),
});

// Schema for validating prompt-based RAG LLM queries
export const userPromptSchema = baseRAGSchema.extend({
  userPrompt: userPromptField,
  topK: z.number().int().min(1).max(100).optional().default(5),
  conversationId: z.string().uuid("Invalid Conversation ID format").optional(),
  userId: z.string().uuid("Invalid User ID format").optional(),
});

export const getContextByIdSchema = z.object({
  chunkIds: z.array(z.string().uuid("Invalid Chunk ID format")).min(1, "At least one Chunk ID must be provided"),
});

// 3. Here, the prompt is OPTIONAL for general chunk retrieval
export const chunkRetreivalSchema = baseRAGSchema.extend({
  chunkIds: z.array(z.string().uuid("Invalid Chunk ID format")).optional(),
  topK: z.number().int().min(1).max(100).optional().default(10),
  vector: z.array(z.number()).length(1024, "Vector must be exactly 1024 dimensions").optional(),
  useQuery: z.boolean().optional().default(false),
  userPrompt: userPromptField.optional(), // Cleanly reused here!
});
