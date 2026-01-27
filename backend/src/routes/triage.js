import { Router } from "express";
// TODO: import database pool from ../db.js
// TODO: import or implement LLM client

const router = Router();

/**
 * POST /triage
 *
 * TODO (candidate):
 * - Validate input
 *   - reject empty text
 *   - reject text > 4000 chars
 * - Design prompt and call LLM
 * - Parse and validate LLM response
 * - Apply confidence guardrail (< 0.6)
 * - Store input and result in PostgreSQL
 * - Return structured JSON response
 */
router.post("/", async (req, res) => {
  return res.status(501).json({
    error: "Not implemented. Implement POST /triage."
  });
});

/**
 * GET /triage/:id
 *
 * TODO (candidate):
 * - Fetch a single triage record by id from PostgreSQL
 * - Return stored result
 * - Handle not found case
 */
router.get("/:id", async (req, res) => {
  return res.status(501).json({
    error: "Not implemented. Implement GET /triage/:id."
  });
});

/**
 * GET /triage?limit=10
 *
 * TODO (candidate):
 * - Read limit from query params
 * - Default to 10
 * - Fetch most recent records ordered by created_at DESC
 * - Return list
 */
router.get("/", async (req, res) => {
  return res.status(501).json({
    error: "Not implemented. Implement GET /triage?limit=10."
  });
});

export default router;
