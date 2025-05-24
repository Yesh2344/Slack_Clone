import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Helper to get user or throw error
async function ensureAuthenticated(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not authenticated. Please sign in.");
  }
  return userId;
}

export const send = mutation({
  args: {
    channelId: v.id("channels"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const authorId = await ensureAuthenticated(ctx);
    if (args.content.trim() === "") {
      throw new Error("Message content cannot be empty");
    }
    const channel = await ctx.db.get(args.channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }

    const messageId = await ctx.db.insert("messages", {
      channelId: args.channelId,
      authorId,
      content: args.content,
    });

    // Create notifications for other users
    // Simplification: Notifies ALL other users. Ideally, this would be channel members.
    const allUsers = await ctx.db.query("users").collect();
    for (const user of allUsers) {
      if (user._id !== authorId) { // Don't notify the sender
        // Check if a similar unread notification already exists to avoid duplicates (optional, but good practice)
        const existingNotification = await ctx.db.query("notifications")
          .withIndex("by_user_and_channel", q => q.eq("userId", user._id).eq("channelId", args.channelId))
          .filter(q => q.eq(q.field("isRead"), false))
          .first();

        if (!existingNotification) { // Or if you want multiple notifications, remove this check
          await ctx.db.insert("notifications", {
            userId: user._id,
            channelId: args.channelId,
            messageId: messageId,
            authorId: authorId,
            isRead: false,
            type: "new_message",
          });
        }
      }
    }
    return messageId;
  },
});

export const list = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    await ensureAuthenticated(ctx);
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .order("asc")
      .collect();

    const messagesWithAuthors = await Promise.all(
      messages.map(async (message) => {
        const author = await ctx.db.get(message.authorId);
        return {
          ...message,
          authorName: author?.name ?? "Unknown User",
          authorImage: author?.image,
        };
      })
    );
    return messagesWithAuthors;
  },
});
