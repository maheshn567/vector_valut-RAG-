import { rerankChunks } from "../utility/reranker.js";
import { generateLlmAnswer } from "../utility/generator.js";
import {userPromptSchema} from "../validation/reterival.validation.js";
import prisma from "../../../prisma/index.js";
import { embedChunks } from "../utility/embedder.js";




export async function generateAnswer(req, res) {
  const result = userPromptSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    });
  }

  const tenantId = req.tenantId;
  const { userPrompt, appId, groupId, docId, topK, conversationId, userId } = result.data;

  try {
    // 1. Verify app context if supplied
    if (appId) {
      const app = await prisma.app.findUnique({ where: { appId } });
      if (!app || app.tenantId !== tenantId) {
        return res.status(404).json({ success: false, message: "App not found" });
      }
    }

    // 2. Verify group context if supplied
    if (groupId) {
      const group = await prisma.group.findUnique({ where: { groupId } });
      if (!group || group.tenantId !== tenantId) {
        return res.status(404).json({ success: false, message: "Group not found" });
      }
    }

    // 3. Verify document context if supplied
    if (docId) {
      const doc = await prisma.document.findUnique({ where: { docId } });
      if (!doc || doc.tenantId !== tenantId) {
        return res.status(404).json({ success: false, message: "Document not found" });
      }
    }

    // 4. Generate query vector embedding via Voyage microservice
    const embeddings = await embedChunks([{ chunk_id: "query-text", text: userPrompt }]);
    const queryVector = embeddings[0].vector;
    const vectorString = `[${queryVector.join(",")}]`;

    // 5. Perform vector search to get a larger candidate pool of matching chunks (e.g., topK * 4)
    const finalTopK = topK || 5;
    const candidateLimit = finalTopK * 4;

    const queryParams = [tenantId, vectorString];
    let paramCounter = 3; // Positional parameter index tracking for optional filters ($3, $4, ...)

    let queryRawString = `
      SELECT 
        c.chunk_id as "chunk_id",
        c.text,
        c.metadata,
        c.doc_id as "doc_id",
        d.doc_name as "doc_name",
        1 - (c.vector <=> $2::vector) as "similarity"
      FROM chunks c
      JOIN documents d ON c.doc_id = d.doc_id
      WHERE c.tenant_id = $1
    `;

    if (appId) {
      queryRawString += ` AND c.group_id IN (SELECT group_id FROM groups WHERE app_id = $${paramCounter})`;
      queryParams.push(appId);
      paramCounter++;
    }

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

    // Append sorting order and limit parameter at the end
    queryRawString += `
      ORDER BY c.vector <=> $2::vector ASC
      LIMIT $${paramCounter}
    `;
    queryParams.push(candidateLimit);

    const matches = await prisma.$queryRawUnsafe(queryRawString, ...queryParams);

    if (!matches || matches.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No relevant document contexts found to generate an answer.",
        data: {
          answer: "I do not have enough information in my knowledge base to answer this question.",
          citations: [],
          usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        },
      });
    }

    // Fetch previous conversation context history if conversationId is specified
    let conversationHistory = [];
    if (conversationId) {
      const conversation = await prisma.conversation.findFirst({
        where: { conversationId, tenantId },
      });
      if (conversation && Array.isArray(conversation.messages)) {
        conversationHistory = conversation.messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
      }
    }

    // 6. Call Python reranking microservice to refine context selection via helper
    const rerankedChunks = await rerankChunks(userPrompt, matches, finalTopK);

    // 7. Call Python LLM generation endpoint with reranked context via helper
    const generationData = await generateLlmAnswer(
      userPrompt,
      rerankedChunks,
      undefined,
      undefined,
      conversationHistory
    );

    // 8. Enrich LLM citations with parent Document metadata (ID and Name)
    let enrichedCitations = [];
    if (generationData.citations && generationData.citations.length > 0) {
      const citedChunkIds = generationData.citations.map((c) => c.chunk_id);
      
      const chunksWithDocs = await prisma.chunk.findMany({
        where: {
          chunkId: { in: citedChunkIds },
          tenantId,
        },
        select: {
          chunkId: true,
          docId: true,
          text: true,
          document: {
            select: {
              docName: true,
            },
          },
        },
      });

      const docLookupMap = {};
      for (const item of chunksWithDocs) {
        docLookupMap[item.chunkId] = {
          docId: item.docId,
          docName: item.document?.docName || "Unknown Document",
          text: item.text,
        };
      }

      enrichedCitations = generationData.citations.map((c) => ({
        chunk_id: c.chunk_id,
        docId: docLookupMap[c.chunk_id]?.docId,
        docName: docLookupMap[c.chunk_id]?.docName,
        text: docLookupMap[c.chunk_id]?.text,
      }));
    }

    // 9. Save message turn to Conversation history if conversationId or userId is provided
    let activeConversationId = conversationId;
    const resolvedAppId = appId || req.appId;

    if (activeConversationId) {
      const conversation = await prisma.conversation.findFirst({
        where: { conversationId: activeConversationId, tenantId },
      });

      if (conversation) {
        const currentMessages = Array.isArray(conversation.messages) ? conversation.messages : [];
        const updatedMessages = [
          ...currentMessages,
          { role: "user", content: userPrompt, timestamp: new Date() },
          { role: "assistant", content: generationData.answer, citations: enrichedCitations, timestamp: new Date() }
        ];

        const currentMetadata = conversation.metadata && typeof conversation.metadata === 'object' ? conversation.metadata : {};
        const updatedMetadata = {
          ...currentMetadata,
          lastMessageExcerpt: userPrompt.trim().slice(0, 60) + (userPrompt.trim().length > 60 ? "..." : ""),
          isVoiceSession: req.body.isVoiceSession !== undefined ? req.body.isVoiceSession : currentMetadata.isVoiceSession
        };

        await prisma.conversation.update({
          where: { conversationId: activeConversationId },
          data: { 
            messages: updatedMessages,
            metadata: updatedMetadata
          },
        });
      }
    } else if (userId && resolvedAppId) {
      // Create a new conversation dynamically
      const title = userPrompt.trim().slice(0, 35) + (userPrompt.trim().length > 35 ? "..." : "");
      const newConversation = await prisma.conversation.create({
        data: {
          tenantId,
          appId: resolvedAppId,
          userId,
          messages: [
            { role: "user", content: userPrompt, timestamp: new Date() },
            { role: "assistant", content: generationData.answer, citations: enrichedCitations, timestamp: new Date() }
          ],
          metadata: {
            title: title,
            lastMessageExcerpt: userPrompt.trim().slice(0, 60) + (userPrompt.trim().length > 60 ? "..." : ""),
            isVoiceSession: req.body.isVoiceSession || false
          },
        },
      });
      activeConversationId = newConversation.conversationId;
    }

    return res.status(200).json({
      success: true,
      message: "Answer generated successfully",
      data: {
        answer: generationData.answer,
        citations: enrichedCitations,
        usage: generationData.usage,
        conversationId: activeConversationId, // Return the active conversation ID to the client
      },
    });
  } catch (error) {
    console.error("Error in generateAnswer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate RAG response",
      error: error.message,
    });
  }
}