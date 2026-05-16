import { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import { PERSONAS } from "./constants.js";
import { buildExplainSystemPrompt } from "./prompts.js";
import { streamRequest } from "./api.js";

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function App() {
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [level, setLevel] = useState("beginner");
  const [topic, setTopic] = useState("");
  const [currentTopic, setCurrentTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const addMessage = useCallback((role, content, extra = {}) => {
    const msg = { id: makeId(), role, content, timestamp: Date.now(), ...extra };
    setMessages((prev) => [...prev, msg]);
    return msg.id;
  }, []);

  const updateMessage = useCallback((id, updater) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updater(m) } : m))
    );
  }, []);

  async function explain(mod = null) {
    const t = mod ? currentTopic : topic.trim();
    if (!t || loading) return;

    setCurrentTopic(t);
    setLoading(true);

    // User bubble
    const userLabel = mod
      ? { simpler: "Make it simpler", technical: "Make it more technical", analogy: "Change the analogy style" }[mod]
      : t;
    addMessage("user", userLabel);

    // AI bubble (streaming)
    const aiId = addMessage("ai", "", { streaming: true, topic: t });

    try {
      const sys = buildExplainSystemPrompt(persona, t, level, mod);
      await streamRequest("/api/explain", sys, `Teach me about: ${t}`, (chunk) => {
        updateMessage(aiId, () => ({ content: chunk, streaming: true }));
      });
      // Mark streaming done
      updateMessage(aiId, (m) => ({ ...m, streaming: false }));
    } catch (e) {
      updateMessage(aiId, () => ({ content: `Error: ${e.message}`, streaming: false }));
    } finally {
      setLoading(false);
      if (!mod) setTopic("");
    }
  }

  function handleQuickTopic(t) {
    setTopic(t);
    setCurrentTopic(t);
    // Slight delay so state settles
    setTimeout(() => {
      setTopic("");
      setCurrentTopic(t);
      explainDirect(t);
    }, 50);
  }

  async function explainDirect(t) {
    if (loading) return;
    setCurrentTopic(t);
    setLoading(true);
    addMessage("user", t);
    const aiId = addMessage("ai", "", { streaming: true, topic: t });
    try {
      const sys = buildExplainSystemPrompt(persona, t, level, null);
      await streamRequest("/api/explain", sys, `Teach me about: ${t}`, (chunk) => {
        updateMessage(aiId, () => ({ content: chunk, streaming: true }));
      });
      updateMessage(aiId, (m) => ({ ...m, streaming: false }));
    } catch (e) {
      updateMessage(aiId, () => ({ content: `Error: ${e.message}`, streaming: false }));
    } finally {
      setLoading(false);
      setTopic("");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        background: "var(--bg-base)",
      }}
    >
      <Sidebar
        persona={persona}
        level={level}
        onPersonaChange={(p) => { setPersona(p); setMessages([]); setCurrentTopic(""); }}
        onLevelChange={setLevel}
        onTopicSelect={handleQuickTopic}
      />
      <ChatPanel
        messages={messages}
        persona={persona}
        loading={loading}
        topic={topic}
        onTopicChange={setTopic}
        onSubmit={() => explain(null)}
        onIterate={(mod) => explain(mod)}
        onQuickTopic={handleQuickTopic}
      />
    </div>
  );
}
