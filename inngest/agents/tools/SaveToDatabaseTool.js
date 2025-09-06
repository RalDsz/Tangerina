import { createTool } from "@inngest/agent-kit";
import { z } from "zod";
import { api } from "@/convex/_generated/api"; // Adjust import based on your project

// Define the tool to save IEP scan data to Convex
export const saveToDatabaseTool = createTool({
  name: "save-to-database",
  description: "Saves the extracted IEP scan data to the Convex database.",
  parameters: z.object({
    // File / User metadata
    userId: z.string().optional().describe("The ID of the user who uploaded the scan."),
    fileName: z.string().optional().describe("The original name of the uploaded file."),
    fileDisplayName: z.string().optional().describe("A human-readable display name for the file."),
    fileId: z.string().optional().describe("The Convex storage ID of the uploaded file."),
    uploadedAt: z.string().optional().describe("ISO datetime when the file was uploaded."),
    size: z.number().optional().describe("The size of the file in bytes."),
    mimeType: z.string().optional().describe("The MIME type of the uploaded file."),
    status: z.enum(["processing", "completed", "failed"]).optional().describe(
      "Current processing status of the scan."
    ),

    // Student Information
    childName: z.string().optional().describe("The full name of the student."),
    childDob: z.string().optional().describe("The date of birth of the student (ISO format)."),
    studentId: z.string().optional().describe("The student's unique ID."),
    grade: z.string().optional().describe("The student's current grade."),
    schoolName: z.string().optional().describe("The name of the student's school."),
    schoolDistrict: z.string().optional().describe("The school district of the student."),
    childAddress: z.string().optional().describe("The student's home address."),
    parentGuardianName: z.string().optional().describe("The name of the parent or guardian."),
    parentContact: z.string().optional().describe("Contact information for the parent or guardian."),
    caseManager: z.string().optional().describe("Name of the IEP case manager."),

    // Background / Eligibility
    primaryDisability: z.string().optional().describe("Primary disability of the student."),
    secondaryDisabilities: z.array(z.string()).optional().describe("List of secondary disabilities."),
    evaluationDate: z.string().optional().describe("Date of the student's evaluation (ISO format)."),
    reevaluationDue: z.string().optional().describe("Date when reevaluation is due (ISO format)."),
    eligibilityDetermination: z.string().optional().describe("Eligibility determination notes."),

    // Goals & Objectives
    annualGoals: z.array(
      z.object({
        goal: z.string().optional().describe("The text of the annual goal."),
        area: z.string().optional().describe("The area or domain the goal pertains to."),
        criteria: z.string().optional().describe("Success criteria for the goal."),
        progressMethod: z.string().optional().describe("Method for tracking progress."),
      })
    ).optional().describe("List of annual goals for the student."),
    shortTermObjectives: z.array(
      z.object({
        objective: z.string().optional().describe("Text of the short-term objective."),
        area: z.string().optional().describe("Domain or area of the objective."),
        criteria: z.string().optional().describe("Success criteria for the objective."),
      })
    ).optional().describe("List of short-term objectives."),

    // Services & Supports
    specialEducationServices: z.array(
      z.object({
        service: z.string().optional().describe("Name of the special education service."),
        frequency: z.string().optional().describe("Frequency of the service."),
        location: z.string().optional().describe("Location where the service is delivered."),
        duration: z.string().optional().describe("Duration of the service session."),
      })
    ).optional().describe("Special education services provided to the student."),
    relatedServices: z.array(
      z.object({
        service: z.string().optional().describe("Name of the related service."),
        provider: z.string().optional().describe("Person or organization providing the service."),
        frequency: z.string().optional().describe("Frequency of the related service."),
      })
    ).optional().describe("Related services for the student."),
    assistiveTechnology: z.string().optional().describe("Assistive technology provided."),
    accommodations: z.array(z.string()).optional().describe("List of accommodations provided."),
    modifications: z.array(z.string()).optional().describe("List of modifications provided."),
    behaviorPlan: z.string().optional().describe("Behavior plan details, if applicable."),

    // Placement & Schedule
    placement: z.string().optional().describe("Student placement description."),
    startDate: z.string().optional().describe("IEP start date (ISO format)."),
    endDate: z.string().optional().describe("IEP end date (ISO format)."),
    minutesInGeneralEd: z.number().optional().describe("Minutes spent in general education per week."),
    minutesInSpecialEd: z.number().optional().describe("Minutes spent in special education per week."),
    extendedSchoolYear: z.boolean().optional().describe("Whether the student is enrolled in extended school year."),

    // IEP Team
    iepTeam: z.array(
      z.object({
        name: z.string().optional().describe("Name of the team member."),
        role: z.string().optional().describe("Role of the team member."),
        signature: z.string().optional().describe("Signature of the team member."),
        date: z.string().optional().describe("Date of signature or participation."),
      })
    ).optional().describe("List of IEP team members."),

    // Legal / Admin
    consentSigned: z.boolean().optional().describe("Whether consent was signed."),
    consentDate: z.string().optional().describe("Date when consent was signed."),
    meetingDate: z.string().optional().describe("Date of the IEP meeting."),
    nextMeetingDue: z.string().optional().describe("Date when the next meeting is due."),

    // Raw Text
    rawText: z.string().optional().describe("Full unstructured text of the uploaded scan."),
  }),
  handler: async ({ input, context }) => {
    console.log("Saving IEP scan data to database:", input);

    try {
      // Call your Convex mutation (replace with your actual mutation)
      // TODO: Implement updateScanWithExtractedData function in ocr.ts
      // const result = await api.ocr.updateScanWithExtractedData(input);
      const result = { addedToDb: "success" }; // Placeholder

      // Optional: KV storage logic
      if (result?.addedToDb === "success") {
        context.network?.state.kv.set("saved-to-database", true);
        context.network?.state.kv.set("scan", result.scanId);
      }

      return { success: true, message: "Scan data saved successfully.", result };
    } catch (error) {
      console.error("Error saving scan to database:", error);
      return { success: false, message: error.message };
    }
  },
});
