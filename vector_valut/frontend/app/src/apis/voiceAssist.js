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
  transcribeAudio: async (audioFile, userId, options = {}) => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("user_id", userId);
    formData.append("transcribe", "true");
    
    if (options.appId) formData.append("appId", options.appId);
    if (options.groupId) formData.append("groupId", options.groupId);
    if (options.docId) formData.append("docId", options.docId);
    if (options.topK) formData.append("topK", String(options.topK));
    if (options.conversationId) formData.append("conversationId", options.conversationId);
    
    return api.post("/voice-assist/transcribe", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Translate voice audio file (Uploads via multipart form data)
  translateAudio: async (audioFile, userId, options = {}) => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("user_id", userId);
    formData.append("translation", "true");
    
    if (options.appId) formData.append("appId", options.appId);
    if (options.groupId) formData.append("groupId", options.groupId);
    if (options.docId) formData.append("docId", options.docId);
    if (options.topK) formData.append("topK", String(options.topK));
    if (options.conversationId) formData.append("conversationId", options.conversationId);
    
    return api.post("/voice-assist/translation", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Process text-to-speech query for transcription
  transcribeText: async (text, userId, options = {}) => {
    return api.post("/voice-assist/transcribe", {
      text,
      user_id: userId,
      transcribe: true,
      ...options
    });
  },

  // Process text-to-speech query for translation
  translateText: async (text, userId, options = {}) => {
    return api.post("/voice-assist/translation", {
      text,
      user_id: userId,
      translation: true,
      ...options
    });
  }
};

export default voiceAssistService;