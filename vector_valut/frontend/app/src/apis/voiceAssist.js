import api from './axios.js';

const voiceAssistService = {
  // Start session (Stateless hooks placeholder)
  startSession: async () => {
    return api.post('/voice-assist/start');
  },
  
  // End session (Stateless hooks placeholder)
  endSession: async () => {
    return api.post('/voice-assist/end');
  },

  // Transcribe voice audio file (Uploads via multipart form data)
  transcribeAudio: async (audioFile, userId) => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("user_id", userId);
    formData.append("transcribe", "true");
    
    return api.post("/voice-assist/transcribe", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Translate voice audio file (Uploads via multipart form data)
  translateAudio: async (audioFile, userId) => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("user_id", userId);
    formData.append("translation", "true");
    
    return api.post("/voice-assist/translation", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Process text-to-speech query for transcription
  transcribeText: async (text, userId) => {
    return api.post("/voice-assist/transcribe", {
      text,
      user_id: userId,
      transcribe: true,
    });
  },

  // Process text-to-speech query for translation
  translateText: async (text, userId) => {
    return api.post("/voice-assist/translation", {
      text,
      user_id: userId,
      translation: true,
    });
  }
};

export default voiceAssistService;