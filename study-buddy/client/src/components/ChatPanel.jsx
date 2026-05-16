import { useEffect, useRef } from "react";
import Message from "./Message.jsx";
import EmptyState from "./EmptyState.jsx";
import InputBar from "./InputBar.jsx";

export default function ChatPanel({
  messages,
  persona,
  loading,
  topic,
  onTopicChange,
  onSubmit,
  onIterate,
  onQuickTopic,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
      {/* Top bar */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--bg-primary)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: persona.accent,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{persona.name}</span>
        <span
          style={{
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 20,
            background: persona.bg,
            color: persona.textColor,
            fontWeight: 500,
          }}
        >
          {persona.tag}
        </span>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {messages.length === 0 ? (
          <EmptyState persona={persona} onTopicSelect={onQuickTopic} />
        ) : (
          messages.map((msg) => (
            <Message
              key={msg.id}
              message={msg}
              persona={persona}
              onIterate={onIterate}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <InputBar
        value={topic}
        onChange={onTopicChange}
        onSubmit={onSubmit}
        loading={loading}
        persona={persona}
      />
    </div>
  );
}
