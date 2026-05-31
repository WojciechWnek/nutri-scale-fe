import { endpoints } from "@/config/endpoints";
import { get, post } from "@/lib/http";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PdfUploadResponse {
  jobId?: string;
  message?: string;
}

export interface JobStatusResponse {
  jobId: string;
  status: string;
  message?: string;
}

export const uploadService = {
  async pdf(file: File): Promise<PdfUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return post<PdfUploadResponse>(endpoints.upload.pdf, formData);
  },

  async getStatus(jobId: string): Promise<JobStatusResponse> {
    return get<JobStatusResponse>(endpoints.upload.status(jobId));
  },

  connectSSE(jobId: string): EventSource {
    const url = `${API_URL}${endpoints.upload.status(jobId)}`;
    return new EventSource(url, { withCredentials: true });
  },
};
