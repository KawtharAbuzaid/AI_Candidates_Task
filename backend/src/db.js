import pg from "pg";

const { Pool } = pg;

// TODO (candidate):
// - Use this pool to run queries
// - Handle connection errors if needed

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
