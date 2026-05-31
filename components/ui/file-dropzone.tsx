"use client";

import { ChangeEvent, RefObject } from "react";
import { Upload } from "lucide-react";

interface FileDropzoneProps {
  inputRef: RefObject<HTMLInputElement | null>;
  maxFileSizeMB: number;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function FileDropzone({
  inputRef,
  maxFileSizeMB,
  disabled,
  onChange,
}: FileDropzoneProps) {
  return (
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
        PDF only, up to {maxFileSizeMB} MB
      </span>
      <input
        ref={inputRef}
        id="pdf-upload"
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={onChange}
        disabled={disabled}
      />
    </label>
  );
}
