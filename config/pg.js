import { config } from "dotenv";
config();
import { Pool } from "pg";

const { DB_PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

(async () => {
  try {
    await pool.connect();
    console.log("Connected to PostgreSQL database");
  } catch (error) {
    console.error("Error connecting to PostgreSQL database:", error);
  }
})();

export default pool;
