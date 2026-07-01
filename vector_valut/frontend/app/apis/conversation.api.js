import api from "./axios";

// Create a new conversation thread
export const createConversation = (data) => api.post("/conversations", data);

// List all conversation threads belonging to a specific User
export const listConversations = (userId) => api.get(`/conversations/user/${userId}`);

// Get messages and details of a single conversation thread
export const getConversation = (conversationId) => api.get(`/conversations/${conversationId}`);

// Append a message turn to a conversation history
export const appendMessage = (conversationId, messageData) => 
  api.post(`/conversations/${conversationId}/message`, messageData);

// Delete an entire conversation thread
export const deleteConversation = (conversationId) => api.delete(`/conversations/${conversationId}`);

const conversationApi = {
  createConversation,
  listConversations,
  getConversation,
  appendMessage,
  deleteConversation,
};

export default conversationApi;
