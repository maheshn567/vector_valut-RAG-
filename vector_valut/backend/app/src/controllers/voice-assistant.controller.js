import prisma from '../../../prisma/index.js';
import Voice_Assistant_Validation from '../validation/voice-assistant.validation.js';
import process_voice from '../utility/voice_assisant.js';
import { generateAnswer } from "./generate.controller.js";

export default async function voice_assistant_controller(req, res) {
  try {
    const payload = {
      audio: req.files?.audio?.[0],
      user_id: req.body?.user_id,
      text: req.body?.text,
      transcribe: req.body?.transcribe === 'true' || req.body?.transcribe === true,
      translation: req.body?.translation === 'true' || req.body?.translation === true,
      appId: req.body?.appId || undefined,
      groupId: req.body?.groupId || undefined,
      docId: req.body?.docId || undefined,
      topK: req.body?.topK ? Number(req.body?.topK) : undefined,
      conversationId: req.body?.conversationId || undefined
    };

    // 1. Validate incoming parameters
    const validation = Voice_Assistant_Validation.safeParse(payload);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          message: validation.error.errors[0].message,
        },
      });
    }

    const { audio, text, transcribe, translation, appId, groupId, docId, topK, conversationId, user_id } = validation.data;

    let userPrompt = "";

    // 2. Transcribe voice audio to text if audio input is uploaded
    if (audio) {
      const transcriptionResult = await process_voice(null, audio, transcribe, translation);
      if (!transcriptionResult.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: transcriptionResult.error?.message || "Failed to transcribe user voice",
          },
        });
      }
      userPrompt = transcriptionResult.data.answer;
    } else {
      userPrompt = text;
    }

    if (!userPrompt || !userPrompt.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Could not transcribe or extract query text.",
        },
      });
    }

    // 3. Process RAG search and LLM completion by invoking the generator internally
    let generatedResponse = null;
    const mockRes = {
      status: (code) => {
        return {
          json: (data) => {
            generatedResponse = { code, data };
          }
        };
      }
    };

    const mockReq = {
      tenantId: req.tenantId, // Set by JWT verify middleware
      body: {
        userPrompt,
        appId,
        groupId,
        docId,
        topK: topK || 5,
        conversationId,
        userId: user_id
      }
    };

    await generateAnswer(mockReq, mockRes);

    if (!generatedResponse || generatedResponse.code !== 200 || !generatedResponse.data?.success) {
      return res.status(400).json({
        success: false,
        error: {
          message: generatedResponse?.data?.message || "RAG engine failed to generate an answer.",
        },
      });
    }

    const answerText = generatedResponse.data.data.answer;
    const citations = generatedResponse.data.data.citations || [];

    // 4. Synthesize final answer text to speech audio bytes
    const ttsResult = await process_voice(answerText, null, transcribe, translation);

    if (!ttsResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          message: ttsResult.error?.message || "Failed to generate speech for final answer.",
        },
      });
    }

    // 5. Return structured response containing answer text, citations, and output speech audio
    return res.status(200).json({
      success: true,
      data: {
        answer: answerText,
        audio: ttsResult.data?.audio || null,
        citations: citations
      }
    });

  } catch (err) {
    console.error("Error inside voice_assistant_controller:", err);
    return res.status(500).json({
      success: false,
      error: {
        message: err.message || "Internal server error during voice processing",
      },
    });
  }
}