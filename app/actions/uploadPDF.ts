"use server";

import { currentUser } from "@clerk/nextjs/server";
import convex from "@/lib/ConvexClient";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
// import { getFileDownloadUrl } from "./getFileDownloadUrl";

type UploadResult = {
  success: boolean;
  message: string;
  scan?: Doc<"ocrResults">;
  data?: {
    scan: Doc<"ocrResults">;
    filename: string;
  };
};

export async function uploadPDF(formData: FormData): Promise<UploadResult> {
  // ✅ Authentication check
  const user = await currentUser();
  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    // ✅ Extract and validate file
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return { success: false, message: "Invalid or missing file" };
    }

    // ✅ Strictly enforce PDF type
    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      return { success: false, message: "Only PDF files are allowed" };
    }

    // ✅ Generate Convex upload URL
    const uploadUrl = await convex.mutation(api.ocr.generateUploadUrl, {});
    if (!uploadUrl || typeof uploadUrl !== "string") {
      return { success: false, message: "Failed to generate upload URL" };
    }

    // ✅ Upload file to Convex storage
    const arrayBuffer = await file.arrayBuffer();
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: new Uint8Array(arrayBuffer),
    });

    if (!uploadResponse.ok) {
      return {
        success: false,
        message: `Upload failed with status ${uploadResponse.status}`,
      };
    }

    const json = await uploadResponse.json().catch(() => null);
    if (!json || typeof json.storageId !== "string") {
      return { success: false, message: "Invalid upload response" };
    }

    const { storageId } = json;

    const scan = await convex.mutation(api.ocr.storeScan, {
  fileId: storageId,
  fileName: file.name,
  size: file.size,
  mimeType: file.type,
  userId: user.id, // ✅ pass userId now
});

    if (!scan) {
      return { success: false, message: "Failed to store scan metadata" };
    }

    // Trigger OCR processing
    try {
      await convex.mutation(api.ocr.runOCR, { fileId: storageId });
    } catch (ocrError) {
      console.error("Failed to trigger OCR:", ocrError);
      // Don't fail the upload if OCR trigger fails
    }

    return {
      success: true,
      message: "PDF uploaded successfully",
      data: {
        scan,
        filename: file.name,
      },
    };
  } catch (err) {
    console.error("uploadPDF error:", err);
    return { success: false, message: "Unexpected server error" };
  }
}
