import pool from "../config/pg.js";

export default class RuleRepository {
  static async createRule({ name, userId, channel, payload, executeAt }, db = pool) {
    const query = `
    INSERT INTO rules (name, user_id, channel, payload, execute_at) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`;

    const { rows } = await db.query(query, [name, userId, channel, payload, executeAt]);
    return rows[0];
  }
}
