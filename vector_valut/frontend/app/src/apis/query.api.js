import api from "./axios";

// Run semantic vector search against document chunks (requires X-API-Key in Axios client)
export const retrieveContext = (data) => api.post("/query/retrieve", data);

// Fetch matching context segments by specific identifiers
export const getContext = (data) => api.post("/query/context", data);

// Ask query to the LLM (RAG with citations and history update)
export const askLlm = (data) => api.post("/query/ask", data);

const queryApi = {
  retrieveContext,
  getContext,
  askLlm,
};

export default queryApi;
