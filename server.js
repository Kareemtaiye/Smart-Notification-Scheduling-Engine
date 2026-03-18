import { config } from "dotenv";
config();
import app from "./app.js";
import pool from "./config/pg.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Notification service is running ${process.env.NODE_ENV} on port ${PORT}`);
});
