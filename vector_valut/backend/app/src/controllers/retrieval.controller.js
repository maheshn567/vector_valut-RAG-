import prisma from "../../../prisma/index.js";
import { embedChunks } from "../utility/embedder.js";
import {
  chunkRetreivalSchema,
  getContextByIdSchema
} from "../validation/reterival.validation.js";

// Fetch chunks by ID or via semantic vector search queries
export async function cunkRetreival(req, res) {
  const result = chunkRetreivalSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    });
  }

  const tenantId = req.tenantId;
  const { chunkIds, topK, vector, useQuery, groupId, docId, userPrompt } = result.data;

  try {
    // 1. Verify group context if supplied
    if (groupId) {
      const group = await prisma.group.findUnique({ where: { groupId } });
      if (!group || group.tenantId !== tenantId) {
        return res.status(404).json({ success: false, message: "Group not found" });
      }
    }

    // 2. Verify document context if supplied
    if (docId) {
      const doc = await prisma.document.findUnique({ where: { docId } });
      if (!doc || doc.tenantId !== tenantId) {
        return res.status(404).json({ success: false, message: "Document not found" });
      }
    }

    // 3. Perform search based on query vs specific lookup
    if (useQuery) {
      let queryVector = vector;
      if (!queryVector) {
        if (!userPrompt) {
          return res.status(400).json({
            success: false,
            message: "userPrompt is required when useQuery is true and vector is not provided",
          });
        }
        const embeddings = await embedChunks([{ chunk_id: "query-text", text: userPrompt }]);
        queryVector = embeddings[0].vector;
      }

      const vectorString = `[${queryVector.join(",")}]`;

      let queryRawString = `
        SELECT 
          c.chunk_id as "chunkId",
          c.doc_id as "docId",
          c.group_id as "groupId",
          c.text,
          c.metadata,
          d.doc_name as "docName",
          1 - (c.vector <=> $2::vector) as "similarity"
        FROM chunks c
        JOIN documents d ON c.doc_id = d.doc_id
        WHERE c.tenant_id = $1
      `;

      const queryParams = [tenantId, vectorString];
      let paramCounter = 3;

      if (groupId) {
        queryRawString += ` AND c.group_id = $${paramCounter}`;
        queryParams.push(groupId);
        paramCounter++;
      }

      if (docId) {
        queryRawString += ` AND c.doc_id = $${paramCounter}`;
        queryParams.push(docId);
        paramCounter++;
      }

      queryRawString += `
        ORDER BY c.vector <=> $2::vector ASC
        LIMIT $${paramCounter}
      `;
      queryParams.push(topK || 10);

      const matches = await prisma.$queryRawUnsafe(queryRawString, ...queryParams);
      return res.status(200).json({
        success: true,
        message: "Semantic search completed successfully",
        data: matches,
      });
    } else {
      if (!chunkIds || chunkIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "chunkIds are required when useQuery is false",
        });
      }

      const matches = await prisma.chunk.findMany({
        where: {
          chunkId: { in: chunkIds },
          tenantId,
        },
        select: {
          chunkId: true,
          docId: true,
          groupId: true,
          text: true,
          metadata: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Chunks retrieved successfully",
        data: matches,
      });
    }
  } catch (error) {
    console.error("Error in cunkRetreival:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve chunks",
      error: error.message,
    });
  }
}

// Fetch raw context information for a specific list of chunk IDs
export async function getContextById(req, res) {
  const result = getContextByIdSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    });
  }

  const tenantId = req.tenantId;
  const { chunkIds } = result.data;

  try {
    const chunks = await prisma.chunk.findMany({
      where: {
        chunkId: { in: chunkIds },
        tenantId,
      },
      select: {
        chunkId: true,
        docId: true,
        groupId: true,
        text: true,
        metadata: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Chunks fetched successfully",
      data: chunks,
    });
  } catch (error) {
    console.error("Error in getContextById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chunk contexts",
      error: error.message,
    });
  }
}


