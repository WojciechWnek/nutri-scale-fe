import { endpoints } from "@/config/endpoints";
import { post } from "@/lib/http";

export interface PdfUploadResponse {
  jobId?: string;
  message?: string;
}

export const uploadService = {
  async pdf(file: File): Promise<PdfUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return post<PdfUploadResponse>(endpoints.upload.pdf, formData);
  },
};
