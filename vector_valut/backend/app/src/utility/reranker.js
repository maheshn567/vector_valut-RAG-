/**
 * Call the Python reranking microservice to refine context chunk selection
 * @param {string} query - The search query string
 * @param {Array} chunks - Candidate chunks containing text and similarity score
 * @param {number} topK - Number of top chunks to return after reranking
 * @returns {Promise<Array>} - Reranked array of chunks { chunk_id, text, score }
 */
export async function rerankChunks(query, chunks, topK) {
  const response = await fetch("http://localhost:8000/rerank", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.RAG_SERVICE_API_KEY || "",
    },
    body: JSON.stringify({
      query,
      results: chunks.map((c) => ({
        chunk_id: c.chunk_id || c.chunkId,
        text: c.text,
        score: parseFloat(c.similarity || c.score || 0),
      })),
      top_k: topK,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RAG reranking service error: ${response.statusText} (${errorText})`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(`Reranking failed: ${result.error?.message || "Unknown error"}`);
  }

  // Keep only chunks with a cross-encoder score of 0.60 or higher
  const filteredResults = result.data.results.filter((item) => item.score >= 0.60);

  return filteredResults;
}
