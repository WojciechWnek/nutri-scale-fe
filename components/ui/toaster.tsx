"use client";

import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-800 dark:group-[.toaster]:text-gray-50 dark:group-[.toaster]:border-gray-700",
          description: "text-gray-500 dark:text-gray-400",
          actionButton:
            "bg-gray-900 text-gray-50 text-xs font-medium hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200",
          cancelButton:
            "bg-transparent text-gray-500 text-xs font-medium hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
        },
      }}
      {...props}
    />
  );
}
