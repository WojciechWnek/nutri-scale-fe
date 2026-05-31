"use client";

import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { ProcessingStatus } from "@/components/ui/processing-status";
import { SelectedFileBar } from "@/components/ui/selected-file-bar";
import { usePdfUpload } from "@/hooks/use-pdf-upload";

export default function UploadPdfPage() {
  const {
    inputRef,
    selectedFile,
    error,
    successMessage,
    isUploading,
    isProcessing,
    processingStep,
    maxFileSizeMB,
    fileSizeLabel,
    handleFileChange,
    clearSelectedFile,
    handleUpload,
  } = usePdfUpload();

  const isBusy = isUploading || isProcessing;

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
          Documents
        </p>
        <h1 className="text-xl font-bold">Upload PDF</h1>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Nutrition document</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Choose a PDF to prepare it for AI parsing.
            </p>
          </div>

          <FileDropzone
            inputRef={inputRef}
            maxFileSizeMB={maxFileSizeMB}
            disabled={isBusy}
            onChange={handleFileChange}
          />

          <ProcessingStatus
            isProcessing={isProcessing}
            step={processingStep}
          />

          {error && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          )}

          {successMessage && (
            <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
              <p>{successMessage}</p>
              <Link
                href="/recipes"
                className="mt-2 inline-flex font-medium text-green-800 underline-offset-4 hover:underline dark:text-green-200"
              >
                View available recipes
              </Link>
            </div>
          )}

          {selectedFile && (
            <SelectedFileBar
              fileName={selectedFile.name}
              fileSizeLabel={fileSizeLabel}
              disabled={isBusy}
              onClear={clearSelectedFile}
            />
          )}

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              disabled={!selectedFile || isBusy}
              isLoading={isUploading}
              onClick={handleUpload}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Upload PDF
                </>
              )}
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
