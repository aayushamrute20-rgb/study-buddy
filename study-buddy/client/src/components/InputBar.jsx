import { useRef } from "react";

export default function InputBar({ value, onChange, onSubmit, loading, persona }) {
  const inputRef = useRef(null);

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div
      style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "12px 20px",
        display: "flex",
        gap: 10,
        alignItems: "center",
        background: "var(--bg-primary)",
      }}
    >
      <div
        style={{
          flex: 1,
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          alignItems: "center",
          background: "var(--bg-secondary)",
          overflow: "hidden",
          transition: "border-color 0.15s",
        }}
        onFocus={() => {}}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter a topic to learn… e.g. Newton's Third Law"
          disabled={loading}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            padding: "10px 14px",
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            color: "var(--text-primary)",
            outline: "none",
          }}
        />
        {value && (
          <button
            onClick={() => { onChange(""); inputRef.current?.focus(); }}
            style={{
              padding: "0 10px",
              border: "none",
              background: "transparent",
              color: "var(--text-tertiary)",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        style={{
          padding: "10px 18px",
          borderRadius: "var(--radius-md)",
          border: "none",
          background: loading || !value.trim() ? "var(--bg-tertiary)" : persona.accent,
          color: loading || !value.trim() ? "var(--text-tertiary)" : "#fff",
          fontSize: 13,
          fontWeight: 500,
          fontFamily: "var(--font-sans)",
          cursor: loading || !value.trim() ? "not-allowed" : "pointer",
          transition: "all 0.15s",
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: 40,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {loading ? "Explaining…" : "Explain →"}
      </button>
    </div>
  );
}
