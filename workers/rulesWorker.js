import { Worker } from "bullmq";
import NotificationService from "../services/notificationService.js";
import connection from "../queues/connection.js";

const worker = new Worker(
  "rulesQueue",
  async job => {
    const { channel, payload } = job.data;

    if (channel === "email") {
      // Simulate sending email
      console.log(`Sending email with payload: ${payload}`);
      await NotificationService.sendEmail(payload); // will Implement this function in notificationService.js later
    }

    if (channel === "webhook") {
      // Simulate sending webhook
      console.log(`Sending webhook with payload: ${payload}`);
      await NotificationService.sendWebhook(payload); // will Implement this function in notificationService.js later
    }
  },

  { connection },
);
