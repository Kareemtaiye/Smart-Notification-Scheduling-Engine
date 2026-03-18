import bcrypt from "bcryptjs";

export default class PasswordUtils {
  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  static async comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
