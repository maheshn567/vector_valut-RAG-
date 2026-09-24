import { z } from 'zod';

const Voice_Assistant_Validation = z.object({
  audio: z.any().optional(), // Multer parses files as plain objects (buffers/metadata), validate as any
  user_id: z.string({
    required_error: "user_id is required",
    invalid_type_error: "user_id must be a string"
  }).uuid("Invalid user_id format"),
  text: z.string({
    invalid_type_error: "text must be a string"
  }).optional(),
  transcribe: z.boolean().optional(),
  translation: z.boolean().optional(),
  
  // Optional RAG context parameters
  appId: z.string().uuid().optional(),
  groupId: z.string().uuid().optional(),
  docId: z.string().uuid().optional(),
  topK: z.number().optional(),
  conversationId: z.string().uuid().optional()
}).refine(data => data.audio || data.text, {
  message: "Either audio or text is required",
  path: ["audio", "text"]
}).refine(data => data.transcribe || data.translation, {
  message: "Either transcribe or translation must be true",
  path: ["transcribe", "translation"]
}).refine(data => !(data.transcribe && data.translation), {
  message: "Transcribe and translation cannot be true at the same time",
  path: ["transcribe", "translation"]
});

export default Voice_Assistant_Validation;
