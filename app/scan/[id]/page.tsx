"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";

type OCRRecord = {
  _id: Id<"ocrResults">;
  fileId: Id<"_storage">;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  rawText: string;
  status: string;
  createdAt: number;
  completedAt?: number;
  error?: string;
};

export default function ScanPage() {
  const params = useParams();
  const router = useRouter();
  const fileIdParam = params?.id;

  const [fileId, setFileId] = useState<Id<"_storage"> | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Parse fileId safely
  useEffect(() => {
    if (fileIdParam && typeof fileIdParam === 'string') {
      try {
        setFileId(fileIdParam as Id<"_storage">);
      } catch (err) {
        console.error("Invalid file ID:", err);
      }
    }
  }, [fileIdParam]);

  // Fetch OCR record
  const scan: OCRRecord | null = useQuery(
    api.ocr.getOCR,
    fileId ? { fileId } : "skip"
  ) ?? null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return "✅";
      case "processing":
        return "⏳";
      case "error":
        return "❌";
      default:
        return "📄";
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleBackToScans = () => {
    router.push('/scans');
  };

  if (!fileId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto pt-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Scan ID</h1>
            <p className="text-gray-600 mb-6">The scan ID provided is not valid.</p>
            <button
              onClick={handleBackToScans}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Scans
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto pt-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <h1 className="text-xl font-semibold text-gray-700">Loading scan data...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBackToScans}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to All Scans
          </button>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <span>{getStatusIcon(scan.status)}</span>
            <span>Scan Details</span>
          </h1>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* File Information Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">{scan.fileName}</h2>
            <div className="flex flex-wrap gap-4 text-blue-100">
              <span>📄 {scan.fileType || "Unknown type"}</span>
              <span>📊 {scan.fileSize ? `${(scan.fileSize / 1024).toFixed(2)} KB` : "Size unknown"}</span>
              <span>🕐 {new Date(scan.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Status and Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      scan.status === "done"
                        ? "bg-green-100 text-green-800"
                        : scan.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : scan.status === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      <span>{getStatusIcon(scan.status)}</span>
                      <span>{scan.status.toUpperCase()}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Created</label>
                  <p className="mt-1 text-gray-900">{new Date(scan.createdAt).toLocaleString()}</p>
                </div>

                {scan.completedAt && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Completed</label>
                    <p className="mt-1 text-gray-900">{new Date(scan.completedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {scan.error && (
                  <div>
                    <label className="text-sm font-semibold text-red-500 uppercase tracking-wide">Error</label>
                    <p className="mt-1 text-red-700 bg-red-50 p-3 rounded-lg">{scan.error}</p>
                  </div>
                )}

                {scan.fileUrl && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Original File</label>
                    <div className="mt-1">
                      <a
                        href={scan.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <span>📥</span>
                        <span>Download File</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Extracted Text */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span>📝</span>
                <span>Extracted Text</span>
              </h3>
              {scan.rawText && (
                <button
                  onClick={() => copyToClipboard(scan.rawText)}
                  className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    copySuccess 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <span>{copySuccess ? "✅" : "📋"}</span>
                  <span>{copySuccess ? "Copied!" : "Copy Text"}</span>
                </button>
              )}
            </div>
            
            {scan.rawText ? (
              <div className="bg-gray-50 rounded-xl p-4 border">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {scan.rawText}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-gray-500">No text extracted yet.</p>
                {scan.status === "processing" && (
                  <p className="text-sm text-blue-600 mt-2">Text extraction in progress...</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={handleBackToScans}
            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium border border-gray-300 transition-colors"
          >
            Back to All Scans
          </button>
          {scan.rawText && (
            <button
              onClick={() => copyToClipboard(scan.rawText)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                copySuccess 
                  ? "bg-green-600 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {copySuccess ? "✅ Copied!" : "Copy All Text"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}