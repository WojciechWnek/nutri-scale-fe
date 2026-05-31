"use client";

import { FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SelectedFileBarProps {
  fileName: string;
  fileSizeLabel: string;
  disabled?: boolean;
  onClear: () => void;
}

export function SelectedFileBar({
  fileName,
  fileSizeLabel,
  disabled,
  onClear,
}: SelectedFileBarProps) {
  return (
    <div className="mt-4 flex items-center justify-between gap-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex min-w-0 items-center gap-3">
        <FileText
          className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {fileName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {fileSizeLabel}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Remove selected PDF"
        onClick={onClear}
        disabled={disabled}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
