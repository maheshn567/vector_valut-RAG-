import process_voice from "./src/utility/voice_assisant.js";
import { generateAnswer } from "./src/controllers/generate.controller.js";

export default function socketHandler(io) {
  io.of("/voice").on("connection", (socket) => {
    console.log("Voice WebSocket client connected:", socket.id);

    // Initial state tracking
    socket.voiceSession = {
      options: {},
      chunks: [],
    };

    // 1. Initialize stream options
    socket.on("start_voice_stream", (options = {}) => {
      console.log(`[Socket ${socket.id}] Starting voice stream. Options:`, options);
      socket.voiceSession = {
        options,
        chunks: [],
      };
    });

    // 2. Accumulate binary audio chunk buffers
    socket.on("audio_chunk", (chunk) => {
      if (socket.voiceSession && chunk) {
        // Support both ArrayBuffer and Buffer types
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        socket.voiceSession.chunks.push(buffer);
      }
    });

    // 3. Process complete audio stream and invoke RAG + TTS pipelines
    socket.on("end_voice_stream", async () => {
      console.log(`[Socket ${socket.id}] End of voice stream detected. Processing...`);
      if (!socket.voiceSession || socket.voiceSession.chunks.length === 0) {
        socket.emit("socket_error", { message: "No audio stream chunks received" });
        return;
      }

      try {
        const { options, chunks } = socket.voiceSession;
        const combinedBuffer = Buffer.concat(chunks);

        // Reset chunks to allow immediate next recording turn
        socket.voiceSession.chunks = [];

        // Build a mock file representation for process_voice
        const audioFile = {
          buffer: combinedBuffer,
          mimetype: "audio/webm",
          originalname: "speech.webm",
        };

        const transcribe = options.transcribe === true;
        const translation = options.translation !== false;

        // A. Transcribe User Speech
        console.log(`[Socket ${socket.id}] Transcribing audio chunks...`);
        const transcriptionResult = await process_voice(null, audioFile, transcribe, translation);
        if (!transcriptionResult.success) {
          throw new Error(transcriptionResult.error?.message || "Failed to transcribe audio stream");
        }

        const userPrompt = transcriptionResult.data.answer;
        if (!userPrompt || !userPrompt.trim()) {
          throw new Error("Transcribed audio yielded an empty query prompt.");
        }

        console.log(`[Socket ${socket.id}] Transcribed query: "${userPrompt}"`);

        // B. Query RAG engine and generate response text
        let generatedResponse = null;
        const mockRes = {
          status: (code) => {
            return {
              json: (data) => {
                generatedResponse = { code, data };
              },
            };
          },
        };

        const mockReq = {
          tenantId: options.tenantId,
          body: {
            userPrompt,
            appId: options.appId || undefined,
            groupId: options.groupId || undefined,
            docId: options.docId || undefined,
            topK: options.topK ? Number(options.topK) : 5,
            conversationId: options.conversationId || undefined,
            userId: options.userId,
            isVoiceSession: true,
          },
        };

        await generateAnswer(mockReq, mockRes);

        if (!generatedResponse || generatedResponse.code !== 200 || !generatedResponse.data?.success) {
          throw new Error(generatedResponse?.data?.message || "RAG engine failed to generate an answer");
        }

        const answerText = generatedResponse.data.data.answer;
        const citations = generatedResponse.data.data.citations || [];
        const conversationId = generatedResponse.data.data.conversationId;

        console.log(`[Socket ${socket.id}] RAG Answer: "${answerText.slice(0, 60)}..."`);

        // C. Synthesize output text back to speech
        console.log(`[Socket ${socket.id}] Synthesizing TTS response audio...`);
        const ttsResult = await process_voice(answerText, null, transcribe, translation);
        if (!ttsResult.success) {
          throw new Error(ttsResult.error?.message || "Failed to synthesize speech for final answer");
        }

        // D. Emit final speech response payload back to client
        socket.emit("speech_response", {
          success: true,
          data: {
            userPrompt,
            answer: answerText,
            audio: ttsResult.data?.audio || null,
            citations,
            conversationId,
          },
        });

      } catch (err) {
        console.error(`[Socket ${socket.id}] Error processing voice:`, err);
        socket.emit("socket_error", { message: err.message || "Failed to process voice stream" });
      }
    });

    socket.on("disconnect", () => {
      console.log("WebSocket client disconnected:", socket.id);
      socket.voiceSession = null;
    });
  });
}