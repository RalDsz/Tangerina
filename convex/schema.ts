import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  scans: defineTable({
    // File metadata
    userId: v.string(),
    fileName: v.string(),
    fileDisplayName: v.optional(v.string()),
    fileId: v.id("_storage"),
    uploadedAt: v.string(), // ISO datetime string
    size: v.number(),
    mimeType: v.string(),
    status: v.string(), // 'processing', 'completed', 'failed'

    // Extracted structured data from IEP
    childName: v.optional(v.string()),
    childDob: v.optional(v.string()), // ISO date
    studentId: v.optional(v.string()),
    grade: v.optional(v.string()),
    schoolName: v.optional(v.string()),
    schoolDistrict: v.optional(v.string()),
    childAddress: v.optional(v.string()),
    parentGuardianName: v.optional(v.string()),
    parentContact: v.optional(v.string()),
    caseManager: v.optional(v.string()),

    // Background / Eligibility
    primaryDisability: v.optional(v.string()),
    secondaryDisabilities: v.optional(v.array(v.string())),
    evaluationDate: v.optional(v.string()),
    reevaluationDue: v.optional(v.string()),
    eligibilityDetermination: v.optional(v.string()),

    // Goals & Objectives
    annualGoals: v.optional(
      v.array(
        v.object({
          goal: v.string(),
          area: v.string(),
          criteria: v.optional(v.string()),
          progressMethod: v.optional(v.string()),
        })
      )
    ),
    shortTermObjectives: v.optional(
      v.array(
        v.object({
          objective: v.string(),
          area: v.string(),
          criteria: v.optional(v.string()),
        })
      )
    ),

    // Services & Supports
    specialEducationServices: v.optional(
      v.array(
        v.object({
          service: v.string(),
          frequency: v.string(),
          location: v.string(),
          duration: v.string(),
        })
      )
    ),
    relatedServices: v.optional(
      v.array(
        v.object({
          service: v.string(),
          provider: v.optional(v.string()),
          frequency: v.string(),
        })
      )
    ),
    assistiveTechnology: v.optional(v.string()),
    accommodations: v.optional(v.array(v.string())),
    modifications: v.optional(v.array(v.string())),
    behaviorPlan: v.optional(v.string()),

    // Placement & Schedule
    placement: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    minutesInGeneralEd: v.optional(v.number()),
    minutesInSpecialEd: v.optional(v.number()),
    extendedSchoolYear: v.optional(v.boolean()),

    // Team Information
    iepTeam: v.optional(
      v.array(
        v.object({
          name: v.string(),
          role: v.string(),
          signature: v.optional(v.string()),
          date: v.optional(v.string()),
        })
      )
    ),

    // Legal / Admin
    consentSigned: v.optional(v.boolean()),
    consentDate: v.optional(v.string()),
    meetingDate: v.optional(v.string()),
    nextMeetingDue: v.optional(v.string()),
  }),
});
