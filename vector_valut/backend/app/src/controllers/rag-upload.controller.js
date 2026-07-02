import crypto from "crypto";
import prisma from "../../../prisma/index.js";
import { RagUploadSchema } from "../validation/document.validation.js";
import { chunkDocument } from "../utility/chunker.js";
import { embedChunks } from "../utility/embedder.js";

// Upload a document content source (File, URL, or raw Text) and process it using the microservice
export async function createRag(req, res) {
  try {
    const ragUpload = RagUploadSchema.safeParse(req.body);
    if (!ragUpload.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        error: ragUpload.error.message,
      });
    }

    const tenantId = req.tenantId; // Injected by verifyJWT middleware
    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Tenant context missing",
      });
    }

    const { groupId, docName, url, text } = ragUpload.data;

    // Verify that at least one extraction source is provided
    if (!req.file && !url && !text) {
      return res.status(400).json({
        success: false,
        message: "At least one input source (file, url, or text) is required",
      });
    }

    // 1. Verify the group exists and belongs to this tenant
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

    // 2. Prepare FormData payload for the Python extraction microservice
    const formData = new FormData();
    if (req.file) {
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append("file", blob, req.file.originalname);
    }
    if (url) formData.append("url", url);
    if (text) formData.append("text", text);

    // 3. Call the Python extraction microservice
    const extractResponse = await fetch("http://localhost:8000/extract", {
      method: "POST",
      headers: {
        "X-API-Key": process.env.RAG_SERVICE_API_KEY || "",
      },
      body: formData, // FormData automatically sets the boundary headers
    });

    if (!extractResponse.ok) {
      const errorText = await extractResponse.text();
      throw new Error(`RAG extraction error: ${extractResponse.statusText} (${errorText})`);
    }

    const extractResult = await extractResponse.json(); // ExtractionResponse inside standard schema
    if (!extractResult.success) {
      throw new Error(`Extraction failed: ${extractResult.error?.message || "Unknown error"}`);
    }

    const extractionData = extractResult.data; // { document_name, content_type, pages, total_pages }

    // 4. Chunk the document pages using the utility helper
    const chunks = await chunkDocument(extractionData);

    // 5. Generate embeddings for all text chunks using the utility helper
    const embeddings = await embedChunks(chunks);

    // Map vector list to key-value pairs for easy lookup
    const embeddingsMap = {};
    for (const item of embeddings) {
      embeddingsMap[item.chunk_id] = item.vector;
    }

    // 6. Save document metadata in the PostgreSQL database (docId is generated automatically by PostgreSQL)
    const document = await prisma.document.create({
      data: {
        groupId,
        tenantId,
        docName: docName || req.file?.originalname || extractionData.document_name || "Uploaded Document",
        docPath: url || req.file?.originalname || "direct-text-source",
        docType: extractionData.content_type || (url ? "url" : "text"),
      },
    });

    const docId = document.docId; // Read the generated UUID from PostgreSQL

    // 7. Save all chunks and their vectors using Prisma raw SQL queries, preserving the Python-generated chunk_id
    for (const chunk of chunks) {
      const vector = embeddingsMap[chunk.chunk_id];
      if (!vector) continue;

      const vectorString = `[${vector.join(",")}]`;

      await prisma.$executeRawUnsafe(
        `INSERT INTO chunks (chunk_id, doc_id, group_id, tenant_id, text, vector, metadata, created_at, updated_at)
         VALUES ($1::uuid, $2::uuid, $3::uuid, $4::uuid, $5, $6::vector, $7::jsonb, NOW(), NOW())`,
        chunk.chunk_id, // Preserve original chunk_id UUID directly
        docId,
        groupId,
        tenantId,
        chunk.text,
        vectorString,
        JSON.stringify(chunk.metadata || {})
      );
    }

    return res.status(200).json({
      success: true,
      message: "Document processed, chunked, embedded, and saved successfully",
      data: {
        document,
        chunksCount: chunks.length,
      },
    });
  } catch (error) {
    console.error("Error at create RAG controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process and create RAG document",
      error: error.message,
    });
  }
}

// Get all documents for the authenticated tenant (with optional group filtering)
export async function getAllRag(req, res) {
  const tenantId = req.tenantId;
  const { groupId } = req.query; // Optional filter by Group (Corpus)

  try {
    const data = await prisma.document.findMany({
      where: {
        tenantId: tenantId,
        ...(groupId ? { groupId } : {}),
      },
      include: {
        _count: {
          select: { chunks: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error in fetching documents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
}

// Fetch a single document's metadata and chunks
export async function getRag(req, res) {
  const { docId } = req.body;
  const tenantId = req.tenantId;

  if (!docId) {
    return res.status(400).json({
      success: false,
      message: "Document ID is required in the request body",
    });
  }

  try {
    const data = await prisma.document.findUnique({
      where: {
        docId: docId,
      },
      include: {
        chunks: {
          select: {
            chunkId: true,
            text: true,
            metadata: true,
            createdAt: true,
          },
        },
      },
    });

    // Enforce tenant isolation (return 404 to avoid leaking existence)
    if (!data || data.tenantId !== tenantId) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error in fetching document:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch document",
    });
  }
}

// Delete a document from the database
export async function deleteRag(req, res) {
  const { id } = req.params; // docId
  const tenantId = req.tenantId;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Document ID is required",
    });
  }

  try {
    // 1. Verify the document exists and belongs to this tenant
    const document = await prisma.document.findUnique({
      where: {
        docId: id,
      },
    });

    if (!document || document.tenantId !== tenantId) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // 2. Delete the document
    await prisma.document.delete({
      where: {
        docId: id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleting document:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete document",
    });
  }
}