import { z } from "zod";

// Schema for validating Tenant creation input (matching schema.prisma)
export const createTenantSchema = z.object({
  orgName: z
    .string()
    .min(3, "Organization name must be at least 3 characters long")
    .max(100, "Organization name must not exceed 100 characters"),
  s3BucketName: z
    .string()
    .min(3, "S3 bucket name must be at least 3 characters long")
    .max(63, "S3 bucket name must not exceed 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/,
      "S3 bucket name must contain only lowercase alphanumeric characters, dots, or hyphens, and begin/end with an alphanumeric character"
    )
    .refine((val) => !val.includes(".."), "S3 bucket name cannot contain consecutive periods")
    .optional(),
});

// Schema for validating Tenant updates (allows partial fields)
export const updateTenantSchema = createTenantSchema.partial();

