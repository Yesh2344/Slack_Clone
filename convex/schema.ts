import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Schema for the futuristic chat application
const applicationTables = {
  channels: defineTable({
    name: v.string(),
  }),
  messages: defineTable({
    channelId: v.id("channels"),
    authorId: v.id("users"),
    content: v.string(),
  }).index("by_channel", ["channelId"]),

  typingIndicators: defineTable({
    channelId: v.id("channels"),
    userId: v.id("users"),
    userName: v.string(),
    lastTyped: v.int64(),
  })
    .index("by_channel_and_user", ["channelId", "userId"])
    .index("by_channel_and_last_typed", ["channelId", "lastTyped"])
    .index("by_last_typed", ["lastTyped"]),

  notifications: defineTable({
    userId: v.id("users"), // The user to be notified
    channelId: v.id("channels"),
    messageId: v.id("messages"),
    authorId: v.id("users"), // User who sent the message causing the notification
    isRead: v.boolean(),
    type: v.literal("new_message"), // For potential future notification types
  })
    .index("by_user_and_read_status", ["userId", "isRead"])
    .index("by_user_and_channel", ["userId", "channelId"]), // To quickly find notifications for a channel
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
