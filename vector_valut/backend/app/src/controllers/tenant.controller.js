import prisma from "../../../prisma/index.js";
import { updateTenantSchema } from "../validation/tenant.validation.js";

// Fetch the authenticated tenant's information
export async function getTenantController(req, res) {
  const tenantId = req.tenantId; // Injected by verifyJWT middleware
  if (!tenantId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Tenant context missing",
    });
  }

  try {
    const data = await prisma.tenant.findUnique({
      where: {
        tenantId: tenantId,
      },
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    // Exclude the hashed password from the response
    const { password: _, ...tenantWithoutPassword } = data;

    return res.status(200).json({
      success: true,
      message: "Tenant fetched successfully",
      data: tenantWithoutPassword,
    });
  } catch (error) {
    console.error("Error in tenant fetching:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tenant details",
    });
  }
}

// Update details of the authenticated tenant
export async function updateTenantController(req, res) {
  const tenantSchema = updateTenantSchema.safeParse(req.body);
  if (!tenantSchema.success) {
    return res.status(400).json({
      success: false,
      message: tenantSchema.error.issues[0].message,
    });
  }

  const tenantId = req.tenantId; // Injected by verifyJWT middleware
  if (!tenantId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Tenant context missing",
    });
  }

  try {
    const data = await prisma.tenant.update({
      where: {
        tenantId: tenantId,
      },
      data: tenantSchema.data,
    });

    // Exclude password from the response
    const { password: _, ...tenantWithoutPassword } = data;

    return res.status(200).json({
      success: true,
      message: "Tenant updated successfully",
      data: tenantWithoutPassword,
    });
  } catch (error) {
    console.error("Error in tenant updating:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tenant details",
    });
  }
}
