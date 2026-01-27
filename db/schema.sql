-- AI Triage Task schema

CREATE TABLE "TriageRequests" (
  "TriageID" BIGSERIAL PRIMARY KEY,
  "InputText" TEXT NOT NULL,
  "ResultJson" JSONB NOT NULL,
  "Model" TEXT,
  "Latency" INTEGER,
  "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "TriageRequests_CreatedAt_idx"
  ON "TriageRequests" ("CreatedAt" DESC);
