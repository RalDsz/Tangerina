import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// -----------------------------
// Generate upload URL
// -----------------------------
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// -----------------------------
// Get file download URL
// -----------------------------
export const getScanDownloadUrl = query({
  args: { fileId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, { fileId }) => {
    return await ctx.storage.getUrl(fileId);
  },
});

// -----------------------------
// Store uploaded scan metadata
// -----------------------------
export const storeScan = mutation({
  args: {
    fileId: v.id("_storage"),
    fileName: v.string(),
    size: v.number(),
    mimeType: v.string(),
    userId: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("ocrResults"),
      _creationTime: v.number(),
      fileId: v.id("_storage"),
      fileName: v.string(),
      fileSize: v.optional(v.number()),
      fileType: v.optional(v.string()),
      fileUrl: v.optional(v.string()),
      rawText: v.string(),
      status: v.string(),
      createdAt: v.number(),
      completedAt: v.optional(v.number()),
      error: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const storageUrl = await ctx.storage.getUrl(args.fileId);
    if (!storageUrl) throw new Error("File not found in storage");

    const scanData = {
      fileId: args.fileId,
      fileName: args.fileName,
      fileSize: args.size,
      fileType: args.mimeType,
      fileUrl: storageUrl,
      rawText: "",
      status: "pending",
      createdAt: Date.now(),
    };

    const scanId = await ctx.db.insert("ocrResults", scanData);
    return await ctx.db.get(scanId);
  },
});

// -----------------------------
// Update OCR status
// -----------------------------
export const updateStatus = mutation({
  args: { fileId: v.id("_storage"), status: v.string(), error: v.optional(v.string()) },
  returns: v.id("ocrResults"),
  handler: async (ctx, { fileId, status, error }) => {
    const existing = await ctx.db
      .query("ocrResults")
      .filter(q => q.eq(q.field("fileId"), fileId))
      .order("desc")
      .first();
    if (!existing) throw new Error("OCR record not found");

    const updateData: any = { status };
    if (error) updateData.error = error;
    if (status === "done" || status === "error") updateData.completedAt = Date.now();

    await ctx.db.patch(existing._id, updateData);
    return existing._id;
  },
});

// -----------------------------
// Update OCR results
// -----------------------------
export const updateResults = mutation({
  args: { fileId: v.id("_storage"), rawText: v.string(), status: v.string() },
  returns: v.id("ocrResults"),
  handler: async (ctx, { fileId, rawText, status }) => {
    const existing = await ctx.db
      .query("ocrResults")
      .filter(q => q.eq(q.field("fileId"), fileId))
      .order("desc")
      .first();
    if (!existing) throw new Error("OCR record not found");

    await ctx.db.patch(existing._id, {
      rawText,
      status,
      completedAt: Date.now(),
    });
    return existing._id;
  },
});

// -----------------------------
// Run OCR processing
// -----------------------------
export const runOCR = mutation({
  args: { fileId: v.id("_storage") },
  returns: v.id("ocrResults"),
  handler: async (ctx, { fileId }) => {
    // Check existing record
    const existing = await ctx.db
      .query("ocrResults")
      .filter(q => q.eq(q.field("fileId"), fileId))
      .order("desc")
      .first();

    if (existing) {
      if (existing.status === "processing" || existing.status === "done") {
        return existing._id;
      }

      // Reset for reprocessing
      await ctx.db.patch(existing._id, {
        status: "processing",
        rawText: "",
        error: undefined,
      });
      await ctx.scheduler.runAfter(0, api.ocrActions.processOCR, { fileId });
      return existing._id;
    }

    // Get file URL for reference
    const fileUrl = await ctx.storage.getUrl(fileId);
    if (!fileUrl) throw new Error("File not found in storage");

    // Get file metadata from storage system table
    const metadata = await ctx.db.system.get(fileId);
    const fileName = metadata?.contentType || "unknown.pdf";

    // Insert new OCR record
    const ocrId = await ctx.db.insert("ocrResults", {
      fileId,
      fileName,
      rawText: "",
      status: "processing",
      createdAt: Date.now(),
    });

    // Schedule OCR processing
    await ctx.scheduler.runAfter(0, api.ocrActions.processOCR, { fileId });

    return ocrId;
  },
});

// -----------------------------
// Get OCR for a file
// -----------------------------
export const getOCR = query({
  args: { fileId: v.id("_storage") },
  returns: v.union(
    v.object({
      _id: v.id("ocrResults"),
      _creationTime: v.number(),
      fileId: v.id("_storage"),
      fileName: v.string(),
      fileSize: v.optional(v.number()),
      fileType: v.optional(v.string()),
      fileUrl: v.optional(v.string()),
      rawText: v.string(),
      status: v.string(),
      createdAt: v.number(),
      completedAt: v.optional(v.number()),
      error: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, { fileId }) => {
    return await ctx.db
      .query("ocrResults")
      .filter(q => q.eq(q.field("fileId"), fileId))
      .order("desc")
      .first();
  },
});

// -----------------------------
// List OCR results with pagination
// -----------------------------
export const listOCRs = query({
  args: { limit: v.optional(v.number()), status: v.optional(v.string()) },
  returns: v.array(v.object({
    _id: v.id("ocrResults"),
    _creationTime: v.number(),
    fileId: v.id("_storage"),
    fileName: v.string(),
    fileSize: v.optional(v.number()),
    fileType: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    rawText: v.string(),
    status: v.string(),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    error: v.optional(v.string()),
  })),
  handler: async (ctx, { limit = 50, status }) => {
    let query = ctx.db.query("ocrResults").order("desc");
    if (status) query = query.filter(q => q.eq(q.field("status"), status));

    return await query.take(Math.min(limit, 100)); // Convex 0.6+ returns array directly
  },
});

// -----------------------------
// Retry failed OCR
// -----------------------------
export const retryOCR = mutation({
  args: { fileId: v.id("_storage") },
  returns: v.id("ocrResults"),
  handler: async (ctx, { fileId }) => {
    const existing = await ctx.db
      .query("ocrResults")
      .filter(q => q.eq(q.field("fileId"), fileId))
      .order("desc")
      .first();
    if (!existing) throw new Error("No OCR record found for this file");
    if (existing.status === "processing") throw new Error("OCR is already in progress");

    await ctx.db.patch(existing._id, { status: "processing", error: undefined, rawText: "" });
    await ctx.scheduler.runAfter(0, api.ocrActions.processOCR, { fileId });

    return existing._id;
  },
});

// -----------------------------
// Get scans for Scans page (with pagination)
// -----------------------------
export const getScans = query({
  args: {
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("done"),
      v.literal("error")
    )),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  returns: v.object({
    results: v.array(v.object({
      _id: v.id("ocrResults"),
      _creationTime: v.number(),
      fileId: v.id("_storage"),
      fileName: v.string(),
      fileSize: v.optional(v.number()),
      fileType: v.optional(v.string()),
      fileUrl: v.optional(v.string()),
      rawText: v.string(),
      status: v.string(),
      createdAt: v.number(),
      completedAt: v.optional(v.number()),
      error: v.optional(v.string()),
    })),
    hasMore: v.boolean(),
    total: v.number(),
  }),
  handler: async (ctx, args) => {
    let query = ctx.db.query("ocrResults");

    if (args.status) {
      query = query.filter(q => q.eq(q.field("status"), args.status));
    }

    const limit = Math.min(args.limit ?? 50, 100);
    const offset = args.offset ?? 0;

    // No .collect() — directly await query results
    const resultsArray = await query.order("desc").take(limit + offset);

    // Apply offset manually
    const paginated = resultsArray.slice(offset, offset + limit);

    return {
      results: paginated,
      hasMore: resultsArray.length > offset + limit,
      total: resultsArray.length,
    };
  },
});

// -----------------------------
// Delete OCR / Scan
// -----------------------------
export const deleteOCR = mutation({
  args: { id: v.id("ocrResults") },
  returns: v.object({ success: v.boolean(), deletedId: v.id("ocrResults"), message: v.string() }),
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.id);
    if (!result) throw new Error("OCR not found");

    try { await ctx.storage.delete(result.fileId); } catch {}
    await ctx.db.delete(args.id);

    return { success: true, deletedId: args.id, message: `Deleted ${result.fileName}` };
  },
});

export const deleteScan = mutation({
  args: { fileId: v.id("_storage") },
  returns: v.object({ success: v.boolean(), deletedId: v.id("ocrResults"), message: v.string() }),
  handler: async (ctx, args) => {
    const result = await ctx.db.query("ocrResults")
      .filter(q => q.eq(q.field("fileId"), args.fileId))
      .first();
    if (!result) throw new Error("Scan not found");

    try { await ctx.storage.delete(args.fileId); } catch {}
    await ctx.db.delete(result._id);

    return { success: true, deletedId: result._id, message: `Deleted ${result.fileName}` };
  },
});

// -----------------------------
// Get OCR statistics
// -----------------------------
export const getStats = query({
  args: {},
  returns: v.object({
    total: v.number(),
    completed: v.number(),
    processing: v.number(),
    failed: v.number(),
    pending: v.number(),
    successRate: v.number(),
  }),
  handler: async (ctx) => {
    const results = await ctx.db.query("ocrResults").take(1000); // fetch top 1000 scans

    const stats = {
      total: results.length,
      completed: results.filter(r => r.status === "done").length,
      processing: results.filter(r => r.status === "processing").length,
      failed: results.filter(r => r.status === "error").length,
      pending: results.filter(r => r.status === "pending").length,
    };

    return {
      ...stats,
      successRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    };
  },
});

