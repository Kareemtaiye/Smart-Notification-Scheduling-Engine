import AuthService from "../services/authService.js";
import TokenService from "../services/tokenService.js";
import AppError from "../utilities/AppError.js";

const cookieOptions = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  path: "/api/v1/auth",
};

export default class AuthController {
  static async signup(req, res, next) {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    const { user, accessToken, refreshToken } = await AuthService.signup(email, password);

    res
      .status(201)
      .cookie("refresh_token", cookieOptions)
      .json({
        status: "success",
        data: {
          user,
          token: accessToken,
        },
      });
  }

  static async login(req, res, next) {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    const user = await AuthService.login({ email, password });

    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    const { userData, accessToken, refreshToken } = user;

    res
      .status(200)
      .cookie("refresh_token", refreshToken, cookieOptions)
      .json({
        status: "success",
        data: {
          user: userData,
          token: accessToken,
        },
      });
  }

  static async logout(req, res, next) {
    const refreshToken = req.cookies.refresh_token;

    //Cookie might be missing
    if (!refreshToken) {
      return next(new AppError("Missing refresh token. May be already logged out.", 400));
    }

    //Invalidate the session in the database
    await AuthService.logout(refreshToken);

    res.clearCookie("refresh_token", { path: "/api/v1/auth" }).status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  }

  static async protect(req, res, next) {
    const authHeader = req.headers.authorization;

    //Check for Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Missing or invalid authorization header", 401));
    }

    const token = authHeader.split(" ")[1];

    const { id, email, role, exp } = TokenService.verifyAccessToken(token);
    if (Date.now() >= exp * 1000) {
      return next(new AppError("Access token expired", 401));
    }

    //Attach user info to request object
    req.user = { id, email, role };
    next();
  }

  static async refreshToken(req, res, next) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return next(new AppError("Missing refresh token", 401));
    }

    const accessTokenData = await AuthService.refreshAccessToken(refreshToken);

    res.json({
      status: "success",
      data: {
        token: accessTokenData.accessToken,
      },
    });
  }
}
