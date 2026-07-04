/**
 * Call the Python generation microservice to generate a citation-backed answer
 * @param {string} query - The user query prompt
 * @param {Array} context - Context chunks with chunk_id, text, and score
 * @param {string} [systemPrompt] - Custom instruction prompt for the LLM
 * @param {string} [provider] - LLM provider (defaults to "nvidia")
 * @returns {Promise<Object>} - The generation result { answer, citations, usage }
 */
export async function generateLlmAnswer(query, context, systemPrompt, provider = "nvidia", history = []) {
  const defaultSystemPrompt = "You are a helpful, professional AI assistant. Answer the question using the provided context chunks. If the context does not contain enough information to answer the question, state that you do not know. Keep your answer precise and accurate.";

  const response = await fetch("http://localhost:8000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.RAG_SERVICE_API_KEY || "",
    },
    body: JSON.stringify({
      query,
      context: context.map((c) => ({
        chunk_id: c.chunk_id || c.chunkId,
        text: c.text,
        score: parseFloat(c.score || 0),
      })),
      system_prompt: systemPrompt || defaultSystemPrompt,
      provider,
      history,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RAG generation service error: ${response.statusText} (${errorText})`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(`Generation failed: ${result.error?.message || "Unknown error"}`);
  }

  return result.data;
}
