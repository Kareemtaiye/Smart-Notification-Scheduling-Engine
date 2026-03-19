import { config } from "dotenv";
config();
import { Pool } from "pg";

// const { DB_PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const {
  DOCKER_DB_PORT,
  DOCKER_DB_HOST,
  DOCKER_DB_USER,
  DOCKER_DB_PASSWORD,
  DOCKER_DB_NAME,
} = process.env;

const pool = new Pool({
  host: DOCKER_DB_HOST,
  port: DOCKER_DB_PORT,
  user: DOCKER_DB_USER,
  password: DOCKER_DB_PASSWORD,
  database: DOCKER_DB_NAME,
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
