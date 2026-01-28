import dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env.example" });

import pg from "pg";
const { Pool } = pg;

console.log("DB URL exists:", !!process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

