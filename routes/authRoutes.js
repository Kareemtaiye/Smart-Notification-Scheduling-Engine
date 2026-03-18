import { Router } from "express";
import AuthController from "../controllers/authController.js";
import handleAsyncErr from "../utilities/handleAsyncErr.js";

const router = Router();

router.post("/signup", handleAsyncErr(AuthController.signup));
router.post("/login", handleAsyncErr(AuthController.login));
router.get("/logout", handleAsyncErr(AuthController.logout));
router.get("/refresh", handleAsyncErr(AuthController.refreshToken));

export default router;
