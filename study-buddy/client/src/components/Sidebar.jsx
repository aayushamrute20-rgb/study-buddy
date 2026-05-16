import { PERSONAS, LEVELS, SAMPLE_TOPICS } from "../constants.js";

export default function Sidebar({ persona, level, onPersonaChange, onLevelChange, onTopicSelect }) {
  return (
    <aside
      style={{
        width: 256,
        flexShrink: 0,
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        padding: "20px 16px",
        gap: 24,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 16, borderBottom: "1px solid var(--border-subtle)" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          📚
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>Study Buddy</div>
          <div style={{ fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.04em" }}>AI TUTOR · ENGINEERING</div>
        </div>
      </div>

      {/* Persona */}
      <div>
        <SectionLabel>Tutor persona</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {PERSONAS.map((p) => {
            const active = persona.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onPersonaChange(p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: "var(--radius-md)",
                  border: active ? "1px solid var(--border-default)" : "1px solid transparent",
                  background: active ? "var(--bg-primary)" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  width: "100%",
                }}
                onMouseOver={(e) => { if (!active) e.currentTarget.style.background = "var(--bg-tertiary)"; }}
                onMouseOut={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: p.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {p.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.tag}
                  </div>
                </div>
                {active && (
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.accent, flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level */}
      <div>
        <SectionLabel>Difficulty</SectionLabel>
        <div style={{ display: "flex", gap: 6 }}>
          {LEVELS.map((l) => {
            const active = level === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onLevelChange(l.id)}
                style={{
                  flex: 1,
                  padding: "7px 0",
                  borderRadius: "var(--radius-md)",
                  border: active ? "1px solid var(--border-default)" : "1px solid var(--border-subtle)",
                  background: active ? "var(--bg-primary)" : "transparent",
                  fontSize: 11,
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick topics */}
      <div>
        <SectionLabel>Quick topics</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {SAMPLE_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => onTopicSelect(t)}
              style={{
                textAlign: "left",
                padding: "6px 8px",
                border: "none",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                fontSize: 12,
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.12s",
                fontFamily: "var(--font-sans)",
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "auto", fontSize: 10, color: "var(--text-tertiary)", lineHeight: 1.7, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
        Powered by Claude. Always verify critical facts with authoritative sources.
      </div>
    </aside>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 8 }}>
      {children}
    </div>
  );
}
