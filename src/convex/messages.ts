import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByService = query({
  args: { serviceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_service", (q) => q.eq("serviceId", args.serviceId))
      .collect()
      .then((m) => m.sort((a, b) => a.createdAt - b.createdAt));
  },
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("messages").collect();
    return all
      .filter((m) => m.userId === args.userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const send = mutation({
  args: {
    userId: v.string(),
    serviceId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
