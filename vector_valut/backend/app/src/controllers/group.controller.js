import crypto from "crypto";
import prisma from "../../../prisma/index.js";
import { createGroupSchema, updateGroupSchema } from "../validation/group.validation.js";

// Create a new Group (corpus) under an App
export async function createGroupController(req, res) {
  try {
    const groupSchema = createGroupSchema.safeParse(req.body);
    if (!groupSchema.success) {
      return res.status(400).json({
        success: false,
        message: groupSchema.error.issues[0].message,
      });
    }

    const { appId, groupName, groupDescription } = groupSchema.data;
    const tenantId = req.tenantId; // Set by verifyJWT middleware

    // 1. Verify that the app exists and belongs to this tenant
    const app = await prisma.app.findUnique({
      where: {
        appId: appId,
      },
    });

    if (!app || app.tenantId !== tenantId) {
      return res.status(404).json({
        success: false,
        message: "App not found",
      });
    }

    // 2. Create the Group
    const data = await prisma.group.create({
      data: {
        appId,
        tenantId,
        groupName,
        groupDescription: groupDescription || "",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      data,
    });
  } catch (error) {
    console.error("Error in group creation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create group",
    });
  }
}

// Fetch a single Group's details
export async function getGroupController(req, res) {
  const { groupId } = req.body;
  const tenantId = req.tenantId;

  if (!groupId) {
    return res.status(400).json({
      success: false,
      message: "Group ID is required in the request body",
    });
  }

  try {
    const data = await prisma.group.findUnique({
      where: {
        groupId: groupId,
      },
    });

    // Enforce tenant isolation (return 404 to avoid leaking existence)
    if (!data || data.tenantId !== tenantId) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Group fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error in fetching group:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch group",
    });
  }
}

// Fetch all Groups belonging to an App
export async function getAppGroupsController(req, res) {
  const { appId } = req.body;
  const tenantId = req.tenantId;

  if (!appId) {
    return res.status(400).json({
      success: false,
      message: "App ID is required in the request body",
    });
  }

  try {
    // 1. Verify that the app exists and belongs to this tenant
    const app = await prisma.app.findUnique({
      where: {
        appId: appId,
      },
    });

    if (!app || app.tenantId !== tenantId) {
      return res.status(404).json({
        success: false,
        message: "App not found",
      });
    }

    // 2. Fetch the groups
    const data = await prisma.group.findMany({
      where: {
        appId: appId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "App groups fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error in fetching app groups:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch groups",
    });
  }
}

// Update a Group
export async function updateGroupController(req, res) {
  const groupSchema = updateGroupSchema.safeParse(req.body);
  if (!groupSchema.success) {
    return res.status(400).json({
      success: false,
      message: groupSchema.error.issues[0].message,
    });
  }

  const { id } = req.params;
  const tenantId = req.tenantId;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Group ID is required",
    });
  }

  try {
    // 1. Verify that the group exists and belongs to this tenant
    const group = await prisma.group.findUnique({
      where: {
        groupId: id,
      },
    });

    if (!group || group.tenantId !== tenantId) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // 2. Update the group
    const data = await prisma.group.update({
      where: {
        groupId: id,
      },
      data: groupSchema.data,
    });

    return res.status(200).json({
      success: true,
      message: "Group updated successfully",
      data,
    });
  } catch (error) {
    console.error("Error in updating group:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update group",
    });
  }
}

// Delete a Group
export async function deleteGroupController(req, res) {
  const { id } = req.params;
  const tenantId = req.tenantId;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Group ID is required",
    });
  }

  try {
    // 1. Verify that the group exists and belongs to this tenant
    const group = await prisma.group.findUnique({
      where: {
        groupId: id,
      },
    });

    if (!group || group.tenantId !== tenantId) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // 2. Delete the group
    await prisma.group.delete({
      where: {
        groupId: id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleting group:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete group",
    });
  }
}
