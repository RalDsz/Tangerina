import { createTool } from "@inngest/agent-kit";
import { z } from "zod";
import { iepScanningAgent } from "../agents/iepScanningAgent";

export const parseIEPTool = createTool({
  name: "parse-iep",
  description:
    "Parses raw IEP scan text or PDF content and extracts all structured fields according to the Convex scans schema.",
  parameters: z.object({
    rawText: z.string().describe("Full text extracted from the IEP scan (OCR/PDF)."),
    fileName: z.string().optional(),
    fileDisplayName: z.string().optional(),
    fileId: z.string().optional(),
    userId: z.string().optional(),
  }),
  handler: async ({ input }) => {
    const parsedData = await iepScanningAgent.run({
      input: {
        rawText: input.rawText,
        fileName: input.fileName ?? null,
        fileDisplayName: input.fileDisplayName ?? null,
        fileId: input.fileId ?? null,
        userId: input.userId ?? null,
      },
    });

    return {
      userId: parsedData.userId ?? null,
      fileName: parsedData.fileName ?? null,
      fileDisplayName: parsedData.fileDisplayName ?? null,
      fileId: parsedData.fileId ?? null,
      uploadedAt: parsedData.uploadedAt ?? null,
      size: parsedData.size ?? null,
      mimeType: parsedData.mimeType ?? null,
      status: parsedData.status ?? null,
      childName: parsedData.childName ?? null,
      childDob: parsedData.childDob ?? null,
      studentId: parsedData.studentId ?? null,
      grade: parsedData.grade ?? null,
      schoolName: parsedData.schoolName ?? null,
      schoolDistrict: parsedData.schoolDistrict ?? null,
      childAddress: parsedData.childAddress ?? null,
      parentGuardianName: parsedData.parentGuardianName ?? null,
      parentContact: parsedData.parentContact ?? null,
      caseManager: parsedData.caseManager ?? null,
      primaryDisability: parsedData.primaryDisability ?? null,
      secondaryDisabilities: parsedData.secondaryDisabilities ?? [],
      evaluationDate: parsedData.evaluationDate ?? null,
      reevaluationDue: parsedData.reevaluationDue ?? null,
      eligibilityDetermination: parsedData.eligibilityDetermination ?? null,
      annualGoals: parsedData.annualGoals ?? [],
      shortTermObjectives: parsedData.shortTermObjectives ?? [],
      specialEducationServices: parsedData.specialEducationServices ?? [],
      relatedServices: parsedData.relatedServices ?? [],
      assistiveTechnology: parsedData.assistiveTechnology ?? null,
      accommodations: parsedData.accommodations ?? [],
      modifications: parsedData.modifications ?? [],
      behaviorPlan: parsedData.behaviorPlan ?? null,
      placement: parsedData.placement ?? null,
      startDate: parsedData.startDate ?? null,
      endDate: parsedData.endDate ?? null,
      minutesInGeneralEd: parsedData.minutesInGeneralEd ?? null,
      minutesInSpecialEd: parsedData.minutesInSpecialEd ?? null,
      extendedSchoolYear: parsedData.extendedSchoolYear ?? null,
      iepTeam: parsedData.iepTeam ?? [],
      consentSigned: parsedData.consentSigned ?? null,
      consentDate: parsedData.consentDate ?? null,
      meetingDate: parsedData.meetingDate ?? null,
      nextMeetingDue: parsedData.nextMeetingDue ?? null,
      rawText: parsedData.rawText ?? input.rawText,
    };
  },
});

export default parseIEPTool;
