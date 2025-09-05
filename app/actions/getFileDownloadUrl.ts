"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/ConvexClient";

type DownloadResult =
  | { success: true; downloadUrl: string }
  | { success: false; error: string };

/**
 * Server action to get a download URL for a file in Convex storage
 */
export async function getFileDownloadUrl(
  fileId: Id<"_storage"> | string
): Promise<DownloadResult> {
  try {
    const downloadUrl = await convex.query(api.scans.getScanDownloadUrl, {
      fileId: fileId as Id<"_storage">,
    });

    if (!downloadUrl) {
      return { success: false, error: "Could not generate download URL" };
    }

    return { success: true, downloadUrl };
  } catch (error) {
    console.error("Error generating download URL:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
