export default function ThinkingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center", verticalAlign: "middle" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--text-tertiary)",
            display: "inline-block",
            animation: `dot 0.9s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30%            { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}
