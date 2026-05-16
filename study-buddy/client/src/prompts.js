const MODIFIER_MAP = {
  simpler:
    "The student asked for a SIMPLER explanation. Use shorter sentences, easier words, and more basic analogies. Reduce complexity significantly.",
  technical:
    "The student asked for a MORE TECHNICAL explanation. Use precise engineering terminology, go deeper into the underlying mechanics, and do not shy away from complexity.",
  analogy:
    "The student wants a COMPLETELY DIFFERENT ANALOGY. Switch to a different domain entirely from what you used before (e.g. if you used sports, now use cooking or architecture).",
};

/**
 * Builds the system prompt for a topic explanation.
 * @param {object} persona  - One of PERSONAS
 * @param {string} topic    - Topic string entered by student
 * @param {string} level    - "beginner" | "intermediate"
 * @param {string|null} modifier - "simpler" | "technical" | "analogy" | null
 */
export function buildExplainSystemPrompt(persona, topic, level, modifier = null) {
  const mod = modifier ? MODIFIER_MAP[modifier] : "";
  return `You are ${persona.prompt}

Your task is to teach the engineering topic "${topic}" to a ${level} student.

${mod}

STRICT OUTPUT FORMAT — follow exactly, no exceptions:
1. Write exactly 3 paragraphs of explanation.
   - Paragraph 1: Introduce the concept in the simplest possible terms.
   - Paragraph 2: Explain the mechanism / how it works, using a strong persona-specific analogy.
   - Paragraph 3: Describe a real-world engineering application or implication.
2. Each paragraph: 3–5 sentences. Prose only — no bullet points, no numbered lists, no bold headers.
3. After the 3 paragraphs, add one blank line then write exactly:
   CHECK_FOR_UNDERSTANDING: followed by one thoughtful conceptual question (not a calculation).
4. Match vocabulary and complexity to a ${level} engineering student.
5. Stay in persona throughout — your tone, style, and analogies must consistently reflect who you are.
6. Do NOT include any preamble, meta-commentary, or sign-off outside the format above.`;
}

/**
 * Builds the system prompt for quiz answer evaluation.
 */
export function buildQuizSystemPrompt(persona, topic, question, studentAnswer) {
  return `You are ${persona.prompt}

Context: The student was learning about "${topic}".
Check-for-understanding question: "${question}"
Student's answer: "${studentAnswer}"

Evaluate the student's answer:
1. Open with exactly one of: ✅ Correct!, ⚠️ Partially correct, or ❌ Not quite.
2. In 2–3 sentences explain what they got right and what they missed.
3. If wrong or partially correct, give a concise re-explanation using your persona's analogy style.
4. Close with one short encouraging line that matches your persona's tone.

Keep the entire response under 120 words. Stay in persona.`;
}

/**
 * Parses raw API text into { explanation, question }.
 */
export function parseResponse(text) {
  const match = text.match(/CHECK_FOR_UNDERSTANDING:\s*([\s\S]+)/i);
  if (match) {
    return {
      explanation: text.slice(0, match.index).trim(),
      question: match[1].trim(),
    };
  }
  return { explanation: text.trim(), question: null };
}
