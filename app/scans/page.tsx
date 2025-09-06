"use client";

import HiroshimaDropZone from "@/components/HiroshimaDropZone";
import ScanList from "@/components/ScanList";

export default function Scans() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 dark:text-white mb-10">
          Upload Your IEP PDFs
        </h1>

        <div className="w-full max-w-5xl">
          <div className="flex justify-center">
            <div className="w-full">
              {/* Animated Dropzone Container */}
              <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <HiroshimaDropZone />               
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-lg">
          Drag and drop your IEP PDFs here, or click to browse. Files under 1MB only.
          Enjoy a smooth, interactive upload experience.
        </p>
      </div>
      <ScanList />
    </>
  );
}