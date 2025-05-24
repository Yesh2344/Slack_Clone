import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Schedule cleanup of old typing indicators every 5 minutes
crons.interval(
  "cleanup old typing indicators",
  { minutes: 5 },
  internal.typing.cleanupOldTypingIndicators, // This should now resolve after a successful deploy
  {}
);

export default crons;
