import { Router } from "express";
import RuleController from "../controllers/ruleController.js";
import handleAsyncErr from "../utilities/handleAsyncErr.js";
import AuthController from "../controllers/authController.js";

const router = Router();

router.use(AuthController.protect);

router.post("/", handleAsyncErr(RuleController.createRule));

export default router;
