import ThinkingDots from "./ThinkingDots.jsx";
import QuizCard from "./QuizCard.jsx";
import { parseResponse } from "../prompts.js";

function FormattedParagraphs({ text }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 14.5,
            lineHeight: 1.85,
            color: "var(--text-primary)",
            marginBottom: i < paragraphs.length - 1 ? 14 : 0,
          }}
          dangerouslySetInnerHTML={{
            __html: p.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"),
          }}
        />
      ))}
    </>
  );
}

function IterationButtons({ onIterate }) {
  const buttons = [
    { mod: "simpler",    label: "Simpler",          icon: "⬇️" },
    { mod: "technical",  label: "More technical",   icon: "⚙️" },
    { mod: "analogy",    label: "New analogy",       icon: "🔄" },
  ];
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
      {buttons.map(({ mod, label, icon }) => (
        <button
          key={mod}
          onClick={() => onIterate(mod)}
          style={{
            padding: "5px 11px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            background: "transparent",
            fontSize: 11,
            fontFamily: "var(--font-sans)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            transition: "all 0.15s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-secondary)"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  );
}

export default function Message({ message, persona, onIterate }) {
  const { role, content, streaming, topic } = message;
  const isUser = role === "user";

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const { explanation, question } = isUser ? { explanation: content, question: null } : parseResponse(content);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        animation: "fadeUp 0.3s ease",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            background: isUser ? "#e8e6e1" : persona.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          {isUser ? "👤" : persona.icon}
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>
          {isUser ? "You" : persona.name}
        </span>
        <span style={{ fontSize: 10, color: "var(--text-tertiary)", marginLeft: "auto" }}>{time}</span>
      </div>

      {/* Body */}
      <div
        style={{
          background: isUser ? "var(--bg-primary)" : "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "14px 18px",
          marginLeft: 32,
        }}
      >
        {streaming && !content ? (
          <ThinkingDots />
        ) : isUser ? (
          <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6 }}>{content}</p>
        ) : (
          <>
            <FormattedParagraphs text={explanation} />
            {streaming && (
              <span style={{ display: "inline-block", marginTop: 8 }}>
                <ThinkingDots />
              </span>
            )}
            {!streaming && question && (
              <QuizCard persona={persona} topic={topic} question={question} />
            )}
            {!streaming && (
              <IterationButtons onIterate={onIterate} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
