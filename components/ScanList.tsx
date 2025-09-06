"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "./ui/table";
import { FileText } from "lucide-react";

// Helper to format date nicely
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


function ScanList() {
  const { user } = useUser();
  const router = useRouter();

  const scans = useQuery(api.ocr.listOCRs, {
    limit: 50,
  });

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-300">
        Please log in to see your scans.
      </div>
    );
  }

  if (!scans) {
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-300">
        No scans found. Upload some IEP PDFs!
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full mt-12 px-4 sm:px-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Your OCR Results
      </h2>

      <div className="w-full max-w-6xl overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md mb-8">
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell className="w-12 text-center"></TableCell>
              <TableCell className="text-left">File Name</TableCell>
              <TableCell className="text-center">Created At</TableCell>
              <TableCell className="text-right">Text Length</TableCell>
              <TableCell className="text-center">Status</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {scans.map((scan) => (
              <TableRow
                key={scan._id.toString()}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => router.push(`/scan/${scan.fileId}`)}
              >
                <TableCell className="text-center">
                  <FileText className="text-red-500 w-5 h-5 mx-auto" />
                </TableCell>

                <TableCell className="text-left font-medium flex items-center gap-2">
                  {scan.fileName}
                </TableCell>

                <TableCell className="text-center">
                  {formatDate(new Date(scan.createdAt).toISOString())}
                </TableCell>

                <TableCell className="text-right">
                  {scan.rawText ? `${Math.round(scan.rawText.length / 1000)}K chars` : "N/A"}
                </TableCell>

                <TableCell className="text-center capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      scan.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : scan.status === "done"
                        ? "bg-green-100 text-green-800"
                        : scan.status === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {scan.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ScanList;
