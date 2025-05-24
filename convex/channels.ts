import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from "./_generated/server";

// Helper to get user or throw error
async function ensureAuthenticated(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ensureAuthenticated(ctx);
    if (args.name.trim() === "") {
      throw new Error("Channel name cannot be empty");
    }
    return await ctx.db.insert("channels", { name: args.name });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await ensureAuthenticated(ctx);
    return await ctx.db.query("channels").order("asc").collect();
  },
});
