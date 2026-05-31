"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { uploadService } from "@/services/upload.service";

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const STATUS_LABELS: Record<string, string> = {
  started: "Starting...",
  extracting_text: "Analyzing PDF...",
  processing_ai: "Parsing content with AI...",
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function usePdfUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const sseRef = useRef<EventSource | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");

  useEffect(() => {
    return () => {
      sseRef.current?.close();
    };
  }, []);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setError("");
    setSuccessMessage("");

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
  }, []);

  const clearSelectedFile = useCallback(() => {
    setSelectedFile(null);
    setError("");
    setSuccessMessage("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const connectSSE = useCallback((jobId: string) => {
    sseRef.current = uploadService.connectSSE(jobId);

    sseRef.current.addEventListener("parsingStatus", (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as Record<string, unknown>;
        const status = String(data.status ?? "");

        if (status === "finished") {
          sseRef.current?.close();
          setIsProcessing(false);
          setIsUploading(false);
          setProcessingStep("");
          setSuccessMessage("PDF processed successfully!");
          return;
        }

        if (status === "failed") {
          sseRef.current?.close();
          setIsProcessing(false);
          setIsUploading(false);
          setProcessingStep("");
          setError(
            typeof data.error === "string" ? data.error : "PDF processing failed.",
          );
          return;
        }

        if (status === "saving_recipes") {
          const count = data.recipeCount ?? 0;
          setProcessingStep(`Saving ${count} recipes...`);
          return;
        }

        setProcessingStep(STATUS_LABELS[status] || status);
      } catch {
        sseRef.current?.close();
        setIsProcessing(false);
        setIsUploading(false);
        setProcessingStep("");
        setError("Failed to parse processing status.");
      }
    });

    sseRef.current.onerror = () => {
      sseRef.current?.close();
      setIsProcessing(false);
      setIsUploading(false);
      setProcessingStep("");
      setError("Connection to processing status lost.");
    };
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile || isUploading || isProcessing) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsUploading(true);

    try {
      const result = await uploadService.pdf(selectedFile);

      if (!result.jobId) {
        setIsUploading(false);
        setSuccessMessage(result.message || "PDF uploaded successfully.");
        return;
      }

      setIsProcessing(true);
      setProcessingStep("Processing...");
      connectSSE(result.jobId);
    } catch (uploadError) {
      setIsProcessing(false);
      setIsUploading(false);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "PDF upload failed. Please try again.",
      );
    }
  }, [selectedFile, isUploading, isProcessing, connectSSE]);

  return {
    inputRef,
    selectedFile,
    error,
    successMessage,
    isUploading,
    isProcessing,
    processingStep,
    maxFileSizeMB: MAX_FILE_SIZE_MB,
    fileSizeLabel: selectedFile ? formatFileSize(selectedFile.size) : "",
    handleFileChange,
    clearSelectedFile,
    handleUpload,
  };
}
