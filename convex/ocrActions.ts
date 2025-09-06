"use node";

import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Hardcoded Gemini API key
const GEMINI_API_KEY = "AIzaSyDADdfV3C7oAfqRSR9g2JgwSbNYepCML3A";

// Action for OCR processing (uses Node.js runtime)
export const processOCR = action({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, { fileId }) => {
    try {
      // Update status to processing
      await ctx.runMutation(api.ocr.updateStatus, {
        fileId,
        status: "processing",
      });

      // Get the file blob from Convex storage
      const fileBlob = await ctx.storage.get(fileId);
      if (!fileBlob) {
        throw new Error("File not found in storage");
      }

      // Convert blob to buffer
      const pdfBuffer = Buffer.from(await fileBlob.arrayBuffer());

      // Use Gemini to extract text from PDF
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent extraction
        },
      });

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBuffer.toString("base64"),
          },
        },
        {
          text: `Extract all visible text from this IEP (Individualized Education Program) document.

Requirements:
- Return ONLY the raw text content
- Preserve the original text structure and formatting
- Include all sections: student information, goals, services, accommodations, etc.
- Do not add any commentary or explanations
- If no text is found, respond with "NO_TEXT_FOUND"

Extract the text now:`,
        },
      ]);

      const extractedText = result.response?.text()?.trim() ?? "";

      if (!extractedText || extractedText === "NO_TEXT_FOUND") {
        throw new Error(
          "No readable text could be extracted from this PDF document"
        );
      }

      // Update with success
      await ctx.runMutation(api.ocr.updateResults, {
        fileId,
        rawText: extractedText,
        status: "done",
      });

      return {
        success: true,
        textLength: extractedText.length,
        preview:
          extractedText.substring(0, 200) +
          (extractedText.length > 200 ? "..." : ""),
      };
    } catch (error) {
      console.error("OCR processing failed:", error);

      // Update with error
      await ctx.runMutation(api.ocr.updateStatus, {
        fileId,
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error occurred during OCR processing",
      });

      throw error;
    }
  },
});
