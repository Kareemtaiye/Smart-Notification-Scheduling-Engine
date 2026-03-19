import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import undhandledRouteHandler from "./middlewares/unhandledRouteHandler.js";
import authRouter from "./routes/authRoutes.js";
import ruleRouter from "./routes/ruleRoutes.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/rules", ruleRouter);

app.use(undhandledRouteHandler);
app.use(globalErrorHandler);
export default app;
