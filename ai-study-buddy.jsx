import { useState } from "react";

export default function StudyBuddy() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState({});
  const [revealed, setRevealed] = useState(false);

  async function generateQuiz() {
    if (!topic.trim()) {
      setError("Enter a topic first");
      return;
    }
    setError("");
    setLoading(true);
    setQuiz(null);
    setSelected({});
    setRevealed(false);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Create a 4-question multiple choice quiz on the topic "${topic}" for a college CS student revising for exams. Respond ONLY with JSON, no markdown fences, no preamble, in this exact shape: {"questions":[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]}`,
            },
          ],
        }),
      });
      const data = await res.json();
      const text = data.content.map((b) => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setQuiz(parsed.questions);
    } catch (e) {
      setError("Couldn't generate quiz. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function pick(qIdx, optIdx) {
    if (revealed) return;
    setSelected((s) => ({ ...s, [qIdx]: optIdx }));
  }

  const score =
    quiz && revealed
      ? quiz.reduce(
          (acc, q, i) => acc + (selected[i] === q.correctIndex ? 1 : 0),
          0
        )
      : null;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>AI study buddy</h1>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
        Enter any topic. Claude writes a quick revision quiz.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Operating Systems - Deadlocks"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
          onKeyDown={(e) => e.key === "Enter" && generateQuiz()}
        />
        <button
          onClick={generateQuiz}
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "#D97757",
            color: "white",
            fontWeight: 500,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "Generate"}
        </button>
      </div>
      {error && <p style={{ color: "#c0392b", fontSize: 13, marginBottom: 8 }}>{error}</p>}

      {quiz && (
        <div style={{ marginTop: 16 }}>
          {quiz.map((q, qi) => (
            <div
              key={qi}
              style={{
                marginBottom: 16,
                padding: 14,
                border: "1px solid #e0e0e0",
                borderRadius: 10,
              }}
            >
              <p style={{ fontWeight: 500, fontSize: 15, marginBottom: 10 }}>
                {qi + 1}. {q.question}
              </p>
              {q.options.map((opt, oi) => {
                const isSelected = selected[qi] === oi;
                const isCorrect = revealed && oi === q.correctIndex;
                const isWrong = revealed && isSelected && oi !== q.correctIndex;
                return (
                  <div
                    key={oi}
                    onClick={() => pick(qi, oi)}
                    style={{
                      padding: "8px 10px",
                      marginBottom: 6,
                      borderRadius: 8,
                      border: "1px solid " + (isSelected ? "#D97757" : "#ddd"),
                      background: isCorrect
                        ? "#e6f5ea"
                        : isWrong
                        ? "#fbe6e6"
                        : isSelected
                        ? "#fdf1ec"
                        : "white",
                      cursor: revealed ? "default" : "pointer",
                      fontSize: 14,
                    }}
                  >
                    {opt}
                  </div>
                );
              })}
              {revealed && (
                <p style={{ fontSize: 13, color: "#555", marginTop: 6 }}>{q.explanation}</p>
              )}
            </div>
          ))}

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "white",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Check answers
            </button>
          ) : (
            <p style={{ textAlign: "center", fontSize: 16, fontWeight: 500 }}>
              Score: {score} / {quiz.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
