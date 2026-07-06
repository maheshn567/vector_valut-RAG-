import crypto from "crypto";
import { createAppSchema, updateAppSchema } from "../validation/app.validation.js";
import prisma from "../../../prisma/index.js";

// Create a new app for the authenticated tenant
export async function createAppController(req, res) {
  try {
    const appSchema = createAppSchema.safeParse(req.body);
    if (!appSchema.success) {
      return res.status(400).json({
        success: false,
        message: appSchema.error.issues[0].message,
      });
    }

    const tenantId = req.tenantId; // Set by verifyJWT middleware
    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing tenant context",
      });
    }

    const data = await prisma.app.create({
      data: {
        tenantId,
        ...appSchema.data,
      },
    });

    return res.status(201).json({
      success: true,
      message: "App created successfully",
      data,
    });
  } catch (error) {
    console.error("Error in app creation:", error);
    if (error.code === "P2003") {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create app",
    });
  }
}

// Fetch a single app by appId, ensuring it belongs to the authenticated tenant
export async function getAppController(req, res) {
  const { appId } = req.body;
  const tenantId = req.tenantId; // Set by verifyJWT middleware

  if (!appId) {
    return res.status(400).json({
      success: false,
      message: "App ID is required in the request body",
    });
  }

  try {
    const data = await prisma.app.findUnique({
      where: {
        appId: appId,
      },
    });

    // Enforce tenant isolation (return 404 to avoid leaking app existence)
    if (!data || data.tenantId !== tenantId) {
      return res.status(404).json({
        success: false,
        message: "App not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "App fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error in fetching app:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch app",
    });
  }
}

// Update app details, ensuring it belongs to the authenticated tenant
export async function updateAppController(req, res) {
  const appSchema = updateAppSchema.safeParse(req.body);
  if (!appSchema.success) {
    return res.status(400).json({
      success: false,
      message: appSchema.error.issues[0].message,
    });
  }

  const { id } = req.params;
  const tenantId = req.tenantId; // Set by verifyJWT middleware

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "App ID is required",
    });
  }

  try {
    // 1. Verify that the app exists and belongs to this tenant
    const app = await prisma.app.findUnique({
      where: {
        appId: id,
      },
    });

    if (!app || app.tenantId !== tenantId) {
      return res.status(404).json({
        success: false,
        message: "App not found",
      });
    }

    // 2. Perform the update
    const data = await prisma.app.update({
      where: {
        appId: id,
      },
      data: appSchema.data,
    });

    return res.status(200).json({
      success: true,
      message: "App updated successfully",
      data,
    });
  } catch (error) {
    console.error("Error in updating app:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update app",
    });
  }
}

// Fetch all apps belonging to the authenticated tenant
export async function getTenantAppsController(req, res) {
  const tenantId = req.tenantId; // Set by verifyJWT middleware
  if (!tenantId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Missing tenant context",
    });
  }

  try {
    const data = await prisma.app.findMany({
      where: {
        tenantId: tenantId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Tenant apps fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error in fetching tenant apps:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tenant apps",
    });
  }
}