import SessionRepository from "../repositories/sessionRepository.js";

export default class SessionService {
  static async createSession({ userId, refreshToken }, client) {
    await SessionRepository.createSession({ userId, refreshToken }, client);
  }

  static async findSessionByRefreshToken(refreshToken, client) {
    return await SessionRepository.findSessionByRefreshToken(refreshToken, client);
  }

  static async invalidateSession(refreshToken, client) {
    await SessionRepository.invalidateSession(refreshToken, client);
  }
}
