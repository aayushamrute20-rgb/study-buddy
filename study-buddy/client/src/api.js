const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Generic streaming call to one of our backend endpoints.
 * Calls onChunk(accumulatedText) as data arrives.
 * Returns the final complete string.
 *
 * @param {string} endpoint      - "/api/explain" | "/api/quiz"
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @param {function} onChunk     - (partialText: string) => void
 * @returns {Promise<string>}
 */
export async function streamRequest(endpoint, systemPrompt, userMessage, onChunk) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemPrompt, userMessage }),
  });

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      errMsg = json.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

    for (const line of lines) {
      const raw = line.slice(6).trim();
      if (raw === "[DONE]" || raw === "") continue;
      try {
        const json = JSON.parse(raw);
        // Anthropic SSE format: content_block_delta with delta.text
        const text = json.delta?.text;
        if (text) {
          accumulated += text;
          onChunk(accumulated);
        }
      } catch {
        // Ignore malformed chunks
      }
    }
  }

  return accumulated;
}
