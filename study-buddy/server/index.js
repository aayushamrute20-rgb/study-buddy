import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"] }));
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── Claude streaming endpoint ─────────────────────────────────────────────────
app.post("/api/explain", async (req, res) => {
  const { systemPrompt, userMessage } = req.body;

  if (!systemPrompt || !userMessage) {
    return res.status(400).json({ error: "systemPrompt and userMessage are required." });
  }

  // Try Claude first, fall back to OpenAI if key missing
  if (process.env.ANTHROPIC_API_KEY) {
    return streamClaude(systemPrompt, userMessage, res);
  }
  if (process.env.OPENAI_API_KEY) {
    return streamOpenAI(systemPrompt, userMessage, res);
  }
  return res.status(500).json({ error: "No API key configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env" });
});

// ── Quiz evaluation endpoint ───────────────────────────────────────────────────
app.post("/api/quiz", async (req, res) => {
  const { systemPrompt, userMessage } = req.body;

  if (!systemPrompt || !userMessage) {
    return res.status(400).json({ error: "systemPrompt and userMessage are required." });
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return streamClaude(systemPrompt, userMessage, res);
  }
  if (process.env.OPENAI_API_KEY) {
    return streamOpenAI(systemPrompt, userMessage, res);
  }
  return res.status(500).json({ error: "No API key configured." });
});

// ── Claude streaming helper ───────────────────────────────────────────────────
async function streamClaude(systemPrompt, userMessage, res) {
  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        stream: true,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.json();
      return res.status(upstream.status).json({ error: err.error?.message || "Claude API error" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Provider", "claude");

    upstream.body.on("data", (chunk) => res.write(chunk));
    upstream.body.on("end", () => res.end());
    upstream.body.on("error", (err) => {
      console.error("Claude stream error:", err);
      res.end();
    });
  } catch (err) {
    console.error("streamClaude error:", err);
    res.status(500).json({ error: err.message });
  }
}

// ── OpenAI streaming helper (fallback) ───────────────────────────────────────
async function streamOpenAI(systemPrompt, userMessage, res) {
  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1000,
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.json();
      return res.status(upstream.status).json({ error: err.error?.message || "OpenAI API error" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Provider", "openai");

    // Convert OpenAI SSE format → Anthropic-style for unified frontend handling
    let buffer = "";
    upstream.body.on("data", (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") {
          res.write("data: {\"type\":\"message_stop\"}\n\n");
          continue;
        }
        try {
          const json = JSON.parse(data);
          const text = json.choices?.[0]?.delta?.content;
          if (text) {
            // Emit in Anthropic SSE format so frontend handles both providers identically
            res.write(`data: ${JSON.stringify({ type: "content_block_delta", delta: { text } })}\n\n`);
          }
        } catch {}
      }
    });
    upstream.body.on("end", () => res.end());
    upstream.body.on("error", () => res.end());
  } catch (err) {
    console.error("streamOpenAI error:", err);
    res.status(500).json({ error: err.message });
  }
}

app.listen(PORT, () => {
  console.log(`\n🎓 Study Buddy server running at http://localhost:${PORT}`);
  console.log(`   Provider: ${process.env.ANTHROPIC_API_KEY ? "Claude ✅" : process.env.OPENAI_API_KEY ? "OpenAI ✅ (fallback)" : "⚠️  No API key found"}\n`);
});
