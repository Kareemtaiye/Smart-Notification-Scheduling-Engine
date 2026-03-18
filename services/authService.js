import pool from "../config/pg.js";
import AuthRepository from "../repositories/authRepository.js";
import PasswordUtils from "../utilities/passwordUtils.js";
import TokenService from "../services/tokenService.js";
import SessionService from "./sessionService.js";

export default class AuthService {
  static async signup(email, password) {
    const client = await pool.connect();

    const hashedPassword = await PasswordUtils.hashPassword(password);
    try {
      await client.query("BEGIN");

      const user = await AuthRepository.createUser(
        { email, password: hashedPassword },
        client,
      );

      const accessToken = TokenService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      const refreshToken = TokenService.generateRefreshToken();

      await SessionService.createSession({ userId: user.id, refreshToken }, client);

      await await client.query("COMMIT");

      return { user, accessToken, refreshToken };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      await client.release();
    }
  }

  static async login({ email, password }) {
    const user = await AuthRepository.findUserByEmail(email);

    if (!user) {
      return null; // User not found
    }

    const isPasswordValid = await PasswordUtils.comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return null; // Invalid password
    }

    const accessToken = TokenService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = TokenService.generateRefreshToken();

    try {
      await SessionService.createSession({ userId: user.id, refreshToken });
    } catch (err) {
      console.log("Error creating session:", err);
      throw err;
    }

    const { password: _, ...userData } = user;

    return { userData, accessToken, refreshToken };
  }

  static async logout(refreshToken) {
    try {
      await SessionService.invalidateSession(refreshToken);
    } catch (err) {
      console.log("Error invalidating session:", err);
      throw err;
    }
  }

  static async refreshAccessToken(refreshToken) {
    const session = await SessionService.findSessionByRefreshToken(refreshToken);

    // Invalid refresh token
    if (!session) {
      return null;
    }

    //Or if expired.
    if (session.expired_at < new Date()) {
      await SessionService.invalidateSession(refreshToken);
      return null;
    }

    const user = await AuthRepository.findUserById(session.user_id);
    //If user no longer exists, invalidate the session and return null
    if (!user) {
      return null;
    }

    const accessToken = TokenService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }
}
