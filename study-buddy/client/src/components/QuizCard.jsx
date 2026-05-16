import { useState, useRef } from "react";
import ThinkingDots from "./ThinkingDots.jsx";
import { buildQuizSystemPrompt } from "../prompts.js";
import { streamRequest } from "../api.js";

export default function QuizCard({ persona, topic, question }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef(null);

  async function handleSubmit() {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setFeedback("");
    try {
      const sys = buildQuizSystemPrompt(persona, topic, question, answer);
      await streamRequest("/api/quiz", sys, "Evaluate my answer.", (chunk) => {
        setFeedback(chunk);
      });
      setSubmitted(true);
    } catch (e) {
      setFeedback(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Detect verdict emoji for color coding
  const verdictColor = feedback.startsWith("✅")
    ? "var(--success)"
    : feedback.startsWith("⚠️")
    ? "var(--warning)"
    : feedback.startsWith("❌")
    ? "var(--danger)"
    : "var(--text-primary)";

  const verdictBg = feedback.startsWith("✅")
    ? "var(--success-bg)"
    : feedback.startsWith("⚠️")
    ? "var(--warning-bg)"
    : feedback.startsWith("❌")
    ? "var(--danger-bg)"
    : "var(--bg-secondary)";

  return (
    <div
      style={{
        marginTop: 14,
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "9px 16px",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span style={{ fontSize: 13 }}>🎯</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Check for understanding
        </span>
      </div>

      {/* Question */}
      <div
        style={{
          padding: "14px 16px",
          fontFamily: "var(--font-serif)",
          fontSize: 14,
          lineHeight: 1.7,
          color: "var(--text-primary)",
        }}
      >
        {question}
      </div>

      {/* Answer area */}
      {!submitted && (
        <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
            placeholder="Type your answer… (⌘+Enter to submit)"
            rows={3}
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderBottom: "1px solid var(--border-subtle)",
              background: "var(--bg-primary)",
              padding: "12px 16px",
              fontSize: 13,
              fontFamily: "var(--font-sans)",
              color: "var(--text-primary)",
              resize: "none",
              outline: "none",
              lineHeight: 1.6,
            }}
          />
          <div
            style={{
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--bg-secondary)",
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-default)",
                background: answer.trim() && !loading ? "var(--bg-primary)" : "transparent",
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "var(--font-sans)",
                color: answer.trim() && !loading ? "var(--text-primary)" : "var(--text-tertiary)",
                cursor: answer.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
              }}
            >
              {loading ? <ThinkingDots /> : "Submit answer →"}
            </button>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>⌘+Enter to submit</span>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid var(--border-subtle)",
            background: verdictBg,
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            lineHeight: 1.75,
            color: verdictColor,
            animation: "fadeUp 0.3s ease",
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
