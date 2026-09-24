import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../../../prisma/index.js";
import { auth } from "../lib/auth.js";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-fallback-super-secret-key";

/**
 * Middleware: Verify JWT Token (Looks in cookies first, falls back to headers)
 */
export async function verifyJWT(req, res, next) {
  try {
    // 1. Check for Better-Auth session (e.g. Google Sign-In)
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (session && session.user) {
      // Find or dynamically create a Tenant workspace record for the OAuth user
      let tenant = await prisma.tenant.findUnique({
        where: { email: session.user.email },
      });

      if (!tenant) {
        tenant = await prisma.tenant.create({
          data: {
            name: session.user.name,
            email: session.user.email,
            password: "", // Social sign-ins don't store passwords
            orgName: `${session.user.name}'s Org`,
            s3BucketName: `tenant-${crypto.randomUUID().slice(0, 8)}`,
          },
        });
      }

      req.tenantId = tenant.tenantId;
      req.user = session.user;
      return next();
    }

    // 2. Fallback to custom JWT token check (Standard credentials flow)
    let token = req.cookies?.token;

    // Fallback to Authorization header if cookies aren't used
    if (!token) {
      const authHeader = req.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: Missing authentication token",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach tenant and user info to request context
    req.tenantId = decoded.tenantId;
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(403).json({
      success: false,
      message: "Forbidden: Invalid or expired token",
    });
  }
}


