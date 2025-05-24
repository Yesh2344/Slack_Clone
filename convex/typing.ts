"use strict";
import { internalMutation, query, mutation } from "./_generated/server"; // Added internalMutation
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
// Removed: import { internal } from "./_generated/api"; // Not needed if not calling other internal functions from here

const TYPING_TIMEOUT_MS = 10_000;
export const CLEANUP_THRESHOLD_MS = 60_000;

async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not authenticated.");
  }
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("Authenticated user not found in database.");
  }
  return user;
}

export const updateTypingStatus = mutation({
  args: {
    channelId: v.id("channels"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_channel_and_user", (q) =>
        q.eq("channelId", args.channelId).eq("userId", user._id)
      )
      .unique();

    if (args.isTyping) {
      const now = BigInt(Date.now());
      if (existing) {
        await ctx.db.patch(existing._id, { lastTyped: now });
      } else {
        await ctx.db.insert("typingIndicators", {
          channelId: args.channelId,
          userId: user._id,
          userName: user.name || "Anonymous",
          lastTyped: now,
        });
      }
    } else {
      if (existing) {
        await ctx.db.delete(existing._id);
      }
    }
  },
});

export const getTypingUsers = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    const threshold = BigInt(Date.now() - TYPING_TIMEOUT_MS);
    const typingUsers = await ctx.db
      .query("typingIndicators")
      .withIndex("by_channel_and_last_typed", (q) =>
        q.eq("channelId", args.channelId).gt("lastTyped", threshold)
      )
      .collect();

    return typingUsers
      .filter((indicator) => indicator.userId !== currentUserId)
      .map((indicator) => indicator.userName);
  },
});

// Changed to internalMutation
export const cleanupOldTypingIndicators = internalMutation({
  args: {},
  handler: async (ctx) => {
    const threshold = BigInt(Date.now() - CLEANUP_THRESHOLD_MS);
    const oldIndicators = await ctx.db
      .query("typingIndicators")
      .withIndex("by_last_typed", (q) => q.lt("lastTyped", threshold))
      .collect();

    for (const indicator of oldIndicators) {
      await ctx.db.delete(indicator._id);
    }
    console.log(`Cleaned up ${oldIndicators.length} old typing indicators.`);
    return oldIndicators.length;
  },
});
