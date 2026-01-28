const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

/**
 * POST /triage
 */
export async function postTriage(text: string) {
  console.log("USING postTriage from api.ts", text);
  const res = await fetch(`${API_BASE}/triage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputText: text }),
  });


  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit triage");
  }

 
  return res.json();
}

/**
 * GET /triage?limit=10
 */
export async function getRecent(limit = 10) {
  const res = await fetch(`${API_BASE}/triage?limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to load recent triage items");
  }

  return res.json();
}
