/**
 * Call the Python embedding microservice to generate Voyage embeddings for a list of text chunks
 * @param {Array} chunks - Array of chunk objects containing `chunk_id` and `text`
 * @returns {Promise<Array>} - Array of chunk embeddings { chunk_id, vector }
 */
export async function embedChunks(chunks) {
  const response = await fetch("http://localhost:8000/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.RAG_SERVICE_API_KEY || "",
    },
    body: JSON.stringify({
      provider: "voyage",
      chunks: chunks.map((c) => ({ chunk_id: c.chunk_id, text: c.text })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RAG embedding error: ${response.statusText} (${errorText})`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(`Embedding failed: ${result.error?.message || "Unknown error"}`);
  }

  return result.data.embeddings;
}
