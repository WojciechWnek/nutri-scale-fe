"use client";

import { ChangeEvent, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPdfPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setSelectedFile(null);
      setError("Please upload a PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setSelectedFile(null);
      setError(`PDF file must be ${MAX_FILE_SIZE_MB} MB or smaller.`);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <nav className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Documents
            </p>
            <h1 className="text-xl font-bold">Upload PDF</h1>
          </div>
          <Button variant="outline" size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Nutrition document</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Choose a PDF to prepare it for AI parsing.
            </p>
          </div>

          <label
            htmlFor="pdf-upload"
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-900 dark:hover:border-blue-400 dark:hover:bg-gray-800"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
              <Upload className="h-7 w-7" aria-hidden="true" />
            </div>
            <span className="text-base font-medium text-gray-900 dark:text-white">
              Select PDF file
            </span>
            <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              PDF only, up to {MAX_FILE_SIZE_MB} MB
            </span>
            <input
              ref={inputRef}
              id="pdf-upload"
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>

          {error && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          )}

          {selectedFile && (
            <div className="mt-4 flex items-center justify-between gap-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex min-w-0 items-center gap-3">
                <FileText
                  className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove selected PDF"
                onClick={clearSelectedFile}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button type="button" disabled={!selectedFile}>
              <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Continue
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
