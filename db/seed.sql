INSERT INTO "TriageRequests" ("InputText", "ResultJson", "Model", "Latency")
VALUES (
  'I was charged twice for my subscription',
  '{"title":"Double charge","category":"billing","priority":"high","summary":"Customer reports being charged twice.","suggested_response":"Apologize, request invoice IDs, confirm refund timeline.","confidence":0.82}',
  'seed',
  0
);
