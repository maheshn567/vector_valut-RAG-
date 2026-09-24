/**
 * Call the Python chunking microservice to split extracted document pages into text chunks
 * @param {Object} documentData - The parsed ExtractionResponse data (doc_name, content_type, pages, etc.)
 * @returns {Promise<Array>} - Array of chunk objects { chunk_id, text, metadata }
 */
export async function chunkDocument(documentData) {
  const response = await fetch("http://localhost:8000/chunk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.RAG_SERVICE_API_KEY || "",
    },
    body: JSON.stringify({
      document: documentData,
      chunk_size: 1000,
      chunk_overlap: 200,
      strategy: "recursive",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RAG chunking error: ${response.statusText} (${errorText})`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(`Chunking failed: ${result.error?.message || "Unknown error"}`);
  }

  return result.data.chunks;
}
