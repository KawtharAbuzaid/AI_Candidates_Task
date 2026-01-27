const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

/**
 * TODO (candidate):
 * - Implement POST /triage call
 * - Handle non-200 responses
 */
export async function postTriage(text: string) {
  throw new Error("Not implemented. Implement postTriage.");
}

/**
 * TODO (candidate):
 * - Implement GET /triage?limit=10
 * - Return parsed JSON
 */
export async function getRecent(limit = 10) {
  throw new Error("Not implemented. Implement getRecent.");
}
