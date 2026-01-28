import { Router } from "express";
import { pool } from "../db.js";

import dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env.example" });

import OpenAI from "openai";

const router = Router();

const client = new OpenAI({ apiKey: process.env.LLM_API_KEY });
const MODEL = process.env.LLM_MODEL || "gpt-4.1";

/**
 * GET /triage?limit=10  
 */
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 10;

    const result = await pool.query(
      'SELECT * FROM "TriageRequests" ORDER BY "CreatedAt" DESC LIMIT $1',
      [limit]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

/**
 * GET /triage/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      'SELECT * FROM "TriageRequests" WHERE "TriageID" = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "not_found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

/**
 * POST /triage
 */
router.post("/", async (req, res) => {
  try {
    const inputText = String(req.body?.inputText ?? "").trim();

    if (!inputText) return res.status(400).json({ error: "Empty Text" });
    if (inputText.length > 4000) return res.status(400).json({ error: "Too Long" });

    const prompt = `
You are an AI support triage system.

Return valid JSON with these keys:
title, category, priority, summary, suggested_response, confidence

Rules:
- category: billing | technical | account | refund | other
- priority: low | medium | high | urgent
- confidence: number between 0 and 1
- No extra text.

Customer message:
"""${inputText}"""
`.trim();

    const gpt = await client.responses.create({
      model: MODEL,
      input: prompt,
    });

    const raw = (gpt.output_text ?? "").trim();

    let resultJson;
    try {
      resultJson = JSON.parse(raw);
    } catch {
      return res.status(502).json({ error: "llm_bad_json", raw });
    }

    const confidence = Number(resultJson.confidence);
    if (!Number.isFinite(confidence)) {
      return res.status(502).json({ error: "llm_missing_confidence", resultJson });
    }

    if (confidence < 0.6) {
      resultJson = {
        ...resultJson,
        title: "Needs human review",
        category: "other",
        priority: "medium",
        summary: "Low confidence triage. Route to a human agent.",
        suggested_response:
          "Thanks for reaching out — we’re reviewing your request and will follow up shortly.",
      };
    }

    await pool.query(
      'INSERT INTO "TriageRequests" ("InputText", "ResultJson", "Model", "Latency") VALUES ($1, $2, $3, $4)',
      [inputText, resultJson, MODEL, 0]
    );

    res.json(resultJson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});

export default router;