import Voice_Assistant_Validation from '../validation/voice-assistant.validation.js';
import process_voice from '../utility/voice_assisant.js';

export default async function voice_assistant_controller(req, res) {
  try {
    const payload = {
      audio: req.files?.audio?.[0],
      user_id: req.body?.user_id,
      text: req.body?.text,
      transcribe: req.body?.transcribe === 'true' || req.body?.transcribe === true,
      translation: req.body?.translation === 'true' || req.body?.translation === true,
    };

    // 1. Perform validation checks using the refined Zod schema
    const validation = Voice_Assistant_Validation.safeParse(payload);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          message: validation.error.errors[0].message,
        },
      });
    }

    const { audio, text, transcribe, translation } = validation.data;

    // 2. Call the voice processing helper
    const result = await process_voice(text, audio, transcribe, translation);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          message: result.error?.message || "Failed to process voice request",
        },
      });
    }

    // 3. Return successfully processed voice text and audio bytes
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in voice_assistant_controller:", err);
    return res.status(500).json({
      success: false,
      error: {
        message: err.message || "Internal server error during voice processing",
      },
    });
  }
}