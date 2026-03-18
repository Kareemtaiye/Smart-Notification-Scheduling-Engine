import crypto from "crypto";
import jwt from "jsonwebtoken";

const { JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRATION } = process.env;

export default class TokenService {
  static generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRATION,
    });
  }

  static generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }
}
