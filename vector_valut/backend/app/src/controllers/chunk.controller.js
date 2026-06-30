import prisma from "../../../prisma/index.js";

export async function getChunkLength(req, res) {
  const { groupId } = req.body;
  const tenantId = req.tenantId;

  if (!groupId) {
    return res.status(400).json({
      success: false,
      message: "Group ID is required in the request body",
    });
  }

  try {
    // 1. Verify group exists and belongs to the authenticated tenant
    const group = await prisma.group.findUnique({
      where: {
        groupId: groupId,
      },
    });

    if (!group || group.tenantId !== tenantId) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // 2. Count the chunks
    const data = await prisma.chunk.count({
      where: {
        groupId: groupId,
        tenantId: tenantId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Chunk length fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching chunk length:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chunk length",
    });
  }
}