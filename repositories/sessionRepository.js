import pool from "../config/pg.js";

export default class SessionRepository {
  static async createSession({ userId, refreshToken }, db = pool) {
    const query = `
    INSERT INTO sessions (user_id, refresh_token) 
    VALUES ($1, $2)
    `;

    await db.query(query, [userId, refreshToken]);
  }

  static async findSessionByRefreshToken(refreshToken, db = pool) {
    const query = `
    SELECT * FROM sessions
    WHERE refresh_token = $1
    `;

    const { rows } = await db.query(query, [refreshToken]);

    return rows[0];
  }

  static async invalidateSession(refreshToken, db = pool) {
    const query = `
    UPDATE sessions 
    SET revoked_at = NOW()
    WHERE refresh_token = $1
    `;
    await db.query(query, [refreshToken]);
  }
}
