"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { uploadPDF } from "@/app/actions/uploadPDF";

export default function PDFDropzone() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const processFile = async (selectedFile: File) => {
    if (!selectedFile) return;

    const isPDF =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");
    if (!isPDF) {
      toast.error("🚫 Only PDF files are allowed");
      return;
    }

    if (selectedFile.size > 1024 * 1024) {
      toast.error("⚠️ File too large! Max 1 MB allowed.");
      return;
    }

    if (!isSignedIn) {
      toast.error("🔒 Please log in to upload a PDF");
      return;
    }

    if (fileUrl) URL.revokeObjectURL(fileUrl);

    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setFileUrl(url);

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      await new Promise((res) => setTimeout(res, 300));

      const result = await uploadPDF(formData);

      setIsUploading(false);

      if (result.success) {
        toast.success("🎉 PDF uploaded successfully!");
        router.push("/scans");
      } else {
        toast.error(result.message || "Upload failed ❌");
        handleClear();
      }
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      toast.error("Something went wrong 😓");
      handleClear();
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingOver(false);
      const droppedFile = event.dataTransfer?.files?.[0];
      if (droppedFile) processFile(droppedFile);
    },
    [isSignedIn, fileUrl]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const handleClear = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFile(null);
    setFileUrl(null);
    setIsUploading(false);
    toast("🧹 Cleared upload");
  };

  return (
    <DndContext sensors={sensors}>
      <div className="w-full flex justify-center mt-10 md:mt-16 px-4 md:px-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-colors duration-200 cursor-pointer
            ${isDraggingOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            ${file ? "bg-green-50 border-green-500" : ""}
            ${!isSignedIn ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-3" />
              <p className="font-medium text-blue-600">Uploading...</p>
              <p className="text-sm text-gray-500 mt-1">Sit tight, almost there!</p>
            </div>
          ) : file ? (
            <>
              <div className="flex flex-col items-center">
                <FileText className="h-12 w-12 text-green-600 mb-3" />
                <p className="font-medium text-green-700 truncate">{file.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  PDF ready (click Clear to remove)
                </p>
              </div>
              <button
                onClick={handleClear}
                className="mt-4 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-1"
              >
                <X className="h-4 w-4" /> Clear
              </button>
            </>
          ) : (
            <>
              <Upload
                className={`h-12 w-12 mb-3 ${isDraggingOver ? "text-blue-500" : "text-gray-400"}`}
              />
              <p className="font-medium">
                {isDraggingOver ? "Drop your PDF here" : "Drag & drop a PDF, or click to upload"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Only .pdf files under 1 MB allowed
              </p>

              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="pdf-upload"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) processFile(selectedFile);
                }}
                disabled={!isSignedIn}
              />

              <label
                htmlFor="pdf-upload"
                className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors cursor-pointer select-none
                  ${isSignedIn
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
              >
                {isSignedIn ? "Browse Files" : "Login Required"}
              </label>
            </>
          )}
        </div>
      </div>
    </DndContext>
  );
}
  