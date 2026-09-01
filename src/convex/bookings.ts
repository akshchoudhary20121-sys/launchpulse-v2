import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
      .then((b) => b.sort((a, b) => b.createdAt - a.createdAt));
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    serviceId: v.string(),
    serviceName: v.string(),
    date: v.string(),
    time: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const cancel = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "cancelled" });
  },
});
