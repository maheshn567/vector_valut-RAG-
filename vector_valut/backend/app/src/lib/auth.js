import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../../../prisma/index.js";

export const auth = betterAuth({
  basePath: "/api/v1/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Wildcards cover tenant vanity subdomains, whether via Vite directly
  // (acmecorp.localhost:5173) or the nginx proxy (acmecorp.mahesh.com)
  trustedOrigins: [
    "http://localhost:5173",
    "http://*.localhost:5173",
    "http://*.mahesh.com",
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});

export default auth;