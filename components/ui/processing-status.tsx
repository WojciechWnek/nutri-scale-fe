"use client";

import { Loader2 } from "lucide-react";

interface ProcessingStatusProps {
  isProcessing: boolean;
  step: string;
}

export function ProcessingStatus({ isProcessing, step }: ProcessingStatusProps) {
  if (!isProcessing) {
    return null;
  }

  return (
    <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
      <div className="flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>{step}</span>
      </div>
    </div>
  );
}
