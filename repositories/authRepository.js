import pool from "../config/pg.js";

export default class AuthRepository {
  static async createUser({ email, password }, db = pool) {
    const query = `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING id, email, role, created_at, updated_at
    `;

    const { rows } = await db.query(query, [email, password]);

    return rows[0];
  }

  static async findUserByEmail(email, db = pool) {
    const query = `
    SELECT id, email, password, role, created_at, updated_at
    FROM users
    WHERE email = $1
    `;

    const { rows } = await db.query(query, [email]);

    return rows[0];
  }
}
