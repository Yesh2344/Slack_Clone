import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel"; // Added Id import

// Helper to get user or throw error
async function getLoggedInUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await getLoggedInUser(ctx); // Ensure user is logged in
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx);
    const userId = user._id;

    const patchData: { name?: string; image?: string | undefined } = {}; // Changed type here

    if (args.name !== undefined) {
      patchData.name = args.name;
    }

    if (args.avatarStorageId !== undefined) {
      const imageUrl = await ctx.storage.getUrl(args.avatarStorageId);
      if (imageUrl) {
        patchData.image = imageUrl;
      } else {
        console.warn(`Could not get URL for storageId: ${args.avatarStorageId}. Clearing image.`);
        patchData.image = undefined; // Corrected: set to undefined to clear
      }
    } else if (args.avatarStorageId === null) { 
      // Explicitly handle if frontend sends null to clear image without new upload
      // This case might not be hit with current frontend, but good for robustness
      patchData.image = undefined;
    }


    if (Object.keys(patchData).length > 0) {
      await ctx.db.patch(userId, patchData);
    }
    return await ctx.db.get(userId); // Return updated user
  },
});
