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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        body: JSON.stringify({ text: trimmed }),
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
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>AI Support Ticket Triage</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a support message here..."
          style={{ padding: 12, fontSize: 14 }}
        />
        <button disabled={loading} style={{ width: 160, padding: "10px 12px" }}>
          {loading ? "Running..." : "Triage"}
        </button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <h2 style={{ marginTop: 0 }}>{result.title}</h2>
          <p><b>Category:</b> {result.category}</p>
          <p><b>Priority:</b> {result.priority}</p>
          <p><b>Confidence:</b> {result.confidence}</p>
          <p><b>Summary:</b> {result.summary}</p>
          <p><b>Suggested response:</b> {result.suggested_response}</p>
        </div>
      )}

      <h2 style={{ marginTop: 28 }}>Recent</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {recent.map((r, idx) => (
          <div key={r.id ?? idx} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <div style={{ fontWeight: 600 }}>{r.result_json?.title ?? r.title ?? "Untitled"}</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              {r.result_json?.category ?? r.category ?? "other"} , {r.result_json?.priority ?? r.priority ?? "medium"}
            </div>
          </div>
        ))}
        {recent.length === 0 && <div style={{ opacity: 0.7 }}>No items yet.</div>}
      </div>
    </div>
  );
}
