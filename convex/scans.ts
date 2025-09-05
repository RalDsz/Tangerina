import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Generate upload URL for direct client upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Store uploaded scan metadata + full schema fields
export const storeScan = mutation({
  args: {
    fileId: v.id("_storage"),
    fileName: v.string(),
    size: v.number(),
    mimeType: v.string(),
    userId: v.string(), // ✅ require userId from caller
  },
  handler: async (ctx, args) => {
    const { userId } = args; // trust caller, no auth check

    const scanId = await ctx.db.insert("scans", {
      // Core metadata
      userId,
      fileId: args.fileId,
      fileName: args.fileName,
      fileDisplayName: undefined,
      uploadedAt: new Date().toISOString(),
      size: args.size,
      mimeType: args.mimeType,
      status: "pending",

      // Extracted structured data (defaults)
      childName: undefined,
      childDob: undefined,
      studentId: undefined,
      grade: undefined,
      schoolName: undefined,
      schoolDistrict: undefined,
      childAddress: undefined,
      parentGuardianName: undefined,
      parentContact: undefined,
      caseManager: undefined,

      // Background / Eligibility
      primaryDisability: undefined,
      secondaryDisabilities: [],
      evaluationDate: undefined,
      reevaluationDue: undefined,
      eligibilityDetermination: undefined,

      // Goals & Objectives
      annualGoals: [],
      shortTermObjectives: [],

      // Services & Supports
      specialEducationServices: [],
      relatedServices: [],
      assistiveTechnology: undefined,
      accommodations: [],
      modifications: [],
      behaviorPlan: undefined,

      // Placement & Schedule
      placement: undefined,
      startDate: undefined,
      endDate: undefined,
      minutesInGeneralEd: undefined,
      minutesInSpecialEd: undefined,
      extendedSchoolYear: false,

      // Team Information
      iepTeam: [],

      // Legal / Admin
      consentSigned: false,
      consentDate: undefined,
      meetingDate: undefined,
      nextMeetingDue: undefined,
    });

    return await ctx.db.get(scanId);
  },
});

// All other mutations/queries can remain unchanged
