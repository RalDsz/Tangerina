"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { Upload, FileText, X } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs"; // ✅ useAuth added
import { useRouter } from "next/navigation";

// ✅ import your server action
import { uploadPDF } from "@/app/actions/uploadPDF";

export default function PDFDropzone() {
  const { isSignedIn } = useUser();
  // const { getToken } = useAuth(); // ✅ getToken for authenticated requests
  const router = useRouter();

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const processFile = async (selectedFile: File) => {
    console.log("📥 processFile called with:", selectedFile);

    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    const isPDF =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    console.log("✅ Is PDF?", isPDF);

    if (!isPDF) {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (!isSignedIn) {
      console.log("⛔ User not signed in");
      toast.error("Please log in to upload a PDF");
      return;
    }

    if (fileUrl) URL.revokeObjectURL(fileUrl);

    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setFileUrl(url);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      console.log("📤 Sending formData with file:", selectedFile.name);

      // ✅ get Clerk auth token
      // const token = await getToken({ template: "convex" });

      // ✅ pass token to server action
      const result = await uploadPDF(formData);

      console.log("📡 uploadPDF result:", result);

      if (result.success) {
        toast.success("PDF uploaded successfully 🎉");
        console.log("✅ Scan saved:", result.scan);
        router.push("/scans");
      } else {
        toast.error(result.message || "Upload failed");
        handleClear();
      }
    } catch (err) {
      console.error("🔥 Upload error:", err);
      toast.error("Something went wrong");
      handleClear();
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingOver(false);

      console.log("📂 File dropped");

      const droppedFile = event.dataTransfer?.files?.[0];
      if (droppedFile) {
        console.log("📄 Dropped file:", droppedFile);
        processFile(droppedFile);
      } else {
        console.log("⚠️ No file found in drop event");
      }
    },
    [isSignedIn, fileUrl, processFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
    console.log("🖱️ Dragging over dropzone");
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    console.log("👋 Drag left dropzone");
  }, []);

  const handleClear = () => {
    console.log("🧹 Clearing file selection");
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFile(null);
    setFileUrl(null);
    toast("Upload cleared ❌");
  };

  return (
    <DndContext sensors={sensors}>
      <div className="w-full max-w-md mx-auto">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors duration-200 cursor-pointer
            ${isDraggingOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            ${file ? "bg-green-50 border-green-500" : ""}
            ${!isSignedIn ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {file ? (
            <>
              <div className="flex flex-col items-center">
                <FileText className="h-12 w-12 text-green-600 mb-3" />
                <p className="font-medium text-green-700 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PDF uploaded (drag me out to remove)
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
                className={`h-12 w-12 mb-3 ${
                  isDraggingOver ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <p className="font-medium">
                {isDraggingOver
                  ? "Drop your PDF here"
                  : "Drag & drop a PDF, or click to upload"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Only .pdf files allowed
              </p>

              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                id="pdf-upload"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    console.log("📂 File picked from dialog:", selectedFile);
                    processFile(selectedFile);
                  }
                }}
                disabled={!isSignedIn}
              />

              <label
                htmlFor="pdf-upload"
                className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors cursor-pointer ${
                  isSignedIn
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
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
