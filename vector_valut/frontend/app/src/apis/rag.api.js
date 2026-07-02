import api from "./axios";

/**
 * Ingest / Process a document content source (File, URL, or raw Text)
 * @param {FormData|Object} data - Form data containing file, groupId, docName, etc.
 */
export const createRag = (data) => {
  const isFormData = data instanceof FormData;
  return api.post("/rag/create", data, {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  });
};

// Fetch all documents for the authenticated tenant
export const getAllRag = () => api.get("/rag/get-all");

// Fetch details for a specific document (expects { docId } in body)
export const getRag = (data) => api.post("/rag/get-ragdocs", data);

// Delete a document from the vault (requires ID parameter)
export const deleteRag = (id) => api.delete(`/rag/delete-ragdocs/${id}`);

const ragApi = {
  createRag,
  getAllRag,
  getRag,
  deleteRag,
};

export default ragApi;
