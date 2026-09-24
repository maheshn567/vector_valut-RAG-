import { z } from "zod";

export const createConversationSchema = z.object({
  appId: z.string().uuid("Invalid App ID format"),
  userId: z.string().uuid("Invalid User ID format"),
  metadata: z.object({}).optional().default({}),
});

export const appendMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1, "Message content cannot be empty"),
  citations: z.array(
    z.object({
      chunk_id: z.string().uuid("Invalid Chunk ID format"),
      docId: z.string().uuid("Invalid Document ID format").optional(),
      docName: z.string().optional(),
    })
  ).optional(),
});
