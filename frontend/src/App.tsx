/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

type TriageResult = {
  title: string;
  category: "billing" | "technical" | "account" | "other";
  priority: "low" | "medium" | "high";
  summary: string;
  suggested_response: string;
  confidence: number;
};

export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [recent, setRecent] = useState<any[]>([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

  async function loadRecent() {
    try {
      const res = await fetch(`${API_BASE}/triage?limit=10`);
      if (!res.ok) return;
      const data = await res.json();
      setRecent(Array.isArray(data) ? data : data.items ?? []);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    loadRecent();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const trimmed = text.trim();
    if (!trimmed) {
      setError("Enter text first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText: trimmed }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Request failed.");
        return;
      }

      setResult(data);
      await loadRecent();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0f1115",
        color: "#eaeaea",
        fontFamily: "system-ui",
      }}
    >
      {/* Centered container */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "60px 24px",
        }}
      >
        <h1 style={{ fontSize: 36, margin: 0, marginBottom: 20 }}>
          MessageMind: AI-Powered Support Ticket Triage
        </h1>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a support message here..."
            style={{
              padding: 14,
              fontSize: 14,
              borderRadius: 12,
              background: "#151821",
              color: "#eaeaea",
              border: "1px solid #2a2f3a",
              resize: "vertical",
            }}
          />

          <button
            disabled={loading}
            style={{
              width: 160,
              padding: "12px 14px",
              borderRadius: 10,
              border: "none",
              background: loading ? "#333" : "#6c7cff",
              color: "#fff",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Running..." : "Triage"}
          </button>
        </form>

        {error && (
          <p style={{ marginTop: 10, color: "#ff6b6b" }}>{error}</p>
        )}

        {result && (
          <div
            style={{
              marginTop: 24,
              padding: 16,
              borderRadius: 14,
              background: "#151821",
              border: "1px solid #2a2f3a",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{result.title}</h2>
            <p>
              <b>Category:</b> {result.category}
            </p>
            <p>
              <b>Priority:</b> {result.priority}
            </p>
            <p>
              <b>Confidence:</b> {result.confidence}
            </p>
            <p>
              <b>Summary:</b> {result.summary}
            </p>
            <p>
              <b>Suggested response:</b> {result.suggested_response}
            </p>
          </div>
        )}

        <h2 style={{ marginTop: 36, marginBottom: 14 }}>Recent</h2>

        <div style={{ display: "grid", gap: 12 }}>
          {recent.map((r, idx) => {
            const rj = r.ResultJson ?? r.result_json ?? r.resultJson;

            return (
              <div
                key={r.TriageID ?? r.id ?? idx}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: "#151821",
                  border: "1px solid #2a2f3a",
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {rj?.title ?? "Untitled"}
                </div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  {(rj?.category ?? "other")} , {(rj?.priority ?? "medium")}
                </div>
              </div>
            );
          })}

          {recent.length === 0 && (
            <div style={{ opacity: 0.7 }}>No items yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}