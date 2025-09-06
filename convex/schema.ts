// convex/schema.ts (only the relevant table)
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ocrResults: defineTable({
    fileId: v.id("_storage"),
    fileName: v.string(),
    fileSize: v.optional(v.number()),
    fileType: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    rawText: v.string(),
    status: v.string(),           // "processing" | "done" | "error" | "pending"
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    error: v.optional(v.string()),
  }),
});
