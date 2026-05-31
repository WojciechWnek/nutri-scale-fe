"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onExpire: () => void;
  duration?: number;
}

export function UndoDeleteToast({ message, onUndo, onExpire, duration = 5000 }: UndoToastProps) {
  const [progress, setProgress] = useState(100);
  const doneRef = useRef(false);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration && !doneRef.current) {
        doneRef.current = true;
        clearInterval(timer);
        onExpire();
      }
    }, 16);

    return () => clearInterval(timer);
  }, [duration, onExpire]);

  const handleUndo = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onUndo();
  };

  return (
    <div className="w-[360px]">
      <div className="flex items-center gap-3 px-4 pt-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
          <Trash2 className="h-4 w-4" />
        </div>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          type="button"
          onClick={handleUndo}
          className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Undo
        </button>
      </div>
      <div className="mt-3 h-1 w-full bg-gray-100 dark:bg-gray-700/50">
        <div
          className="h-full bg-blue-600 transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
