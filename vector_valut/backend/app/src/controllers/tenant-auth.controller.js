import crypto from "crypto";
import bcrypt from "bcrypt";
import prisma from "../../../prisma/index.js";
import { generateToken } from "../utility/jwt.js";
import {
  tenantValidationRegister,
  tenantValidationLogin,
} from "../validation/tenantAuth.validation.js";

// Cookie configurations for security
const COOKIE_OPTIONS = {
  httpOnly: true, // Prevents client-side scripts from reading the cookie (Mitigates XSS)
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matching JWT expiration)
  sameSite: "strict", // Mitigates CSRF attacks
};

// Register a new Tenant account
export async function tenantRegister(req, res) {
  try {
    const result = tenantValidationRegister.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    const { name, email, password } = result.data;

    const existingTenant = await prisma.tenant.findUnique({
      where: { email },
    });

    if (existingTenant) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const s3BucketName = `tenant-${crypto.randomUUID().slice(0, 8)}`;

    const tenant = await prisma.tenant.create({
      data: {
        name,
        email,
        password: hashedPassword,
        orgName: name,
        s3BucketName,
      },
    });

    const token = generateToken({
      tenantId: tenant.tenantId,
      email: tenant.email,
      name: tenant.name,
    });

    // 1. Send the token as a cookie
    res.cookie("token", token, COOKIE_OPTIONS);

    const { password: _, ...tenantWithoutPassword } = tenant;

    return res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
      data: tenantWithoutPassword, // No token returned in JSON body
    });
  } catch (error) {
    console.error("Error in tenant registration:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
}

// Log in an existing Tenant account
export async function tenantLogin(req, res) {
  try {
    const result = tenantValidationLogin.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    const { email, password } = result.data;

    const tenant = await prisma.tenant.findUnique({
      where: { email },
    });

    if (!tenant) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, tenant.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({
      tenantId: tenant.tenantId,
      email: tenant.email,
      name: tenant.name,
    });

    // 2. Send the token as a cookie
    res.cookie("token", token, COOKIE_OPTIONS);

    const { password: _, ...tenantWithoutPassword } = tenant;

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: tenantWithoutPassword, // No token returned in JSON body
    });
  } catch (error) {
    console.error("Error in tenant login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
}
