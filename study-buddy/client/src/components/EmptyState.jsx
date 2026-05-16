import { SAMPLE_TOPICS } from "../constants.js";

export default function EmptyState({ persona, onTopicSelect }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 32px",
        textAlign: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          marginBottom: 4,
        }}
      >
        {persona.icon}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
        Hi! I'm your {persona.name}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 300, lineHeight: 1.65 }}>
        Ask me to explain any engineering topic and I'll break it down using{" "}
        <em style={{ fontFamily: "var(--font-serif)" }}>{persona.tag.toLowerCase()}</em>.
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Try a topic
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: 400 }}>
          {SAMPLE_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => onTopicSelect(t)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-primary)",
                fontSize: 12,
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "var(--font-sans)",
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
