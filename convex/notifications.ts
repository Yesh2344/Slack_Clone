"use strict";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

async function ensureAuthenticated(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not authenticated.");
  }
  return userId;
}

export const getUnreadNotifications = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ensureAuthenticated(ctx);
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read_status", (q) =>
        q.eq("userId", userId).eq("isRead", false)
      )
      .collect();
  },
});

export const getUnreadNotificationsByChannel = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await ensureAuthenticated(ctx);
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_and_channel", q => q.eq("userId", userId).eq("channelId", args.channelId))
      .filter(q => q.eq(q.field("isRead"), false))
      .collect();
  }
});


export const markChannelNotificationsAsRead = mutation({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await ensureAuthenticated(ctx);
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_channel", (q) =>
        q.eq("userId", userId).eq("channelId", args.channelId)
      )
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, { isRead: true });
    }
  },
});

export const markAllNotificationsAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ensureAuthenticated(ctx);
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read_status", (q) =>
        q.eq("userId", userId).eq("isRead", false)
      )
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, { isRead: true });
    }
  },
});
