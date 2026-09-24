import { z } from "zod";

export const createGroupSchema = z.object({
  appId: z.string().uuid("Invalid App ID format"),
  groupName: z
    .string()
    .min(3, "Group name must be at least 3 characters long")
    .max(100, "Group name must not exceed 100 characters"),
  groupDescription: z
    .string()
    .min(10, "Group description must be at least 10 characters long")
    .max(500, "Group description must not exceed 500 characters")
    .optional(),
});

export const updateGroupSchema = createGroupSchema.partial();
