'use server';

import { apiGet, apiPost, apiPatch, apiFormData } from '@/lib/api';

export async function getPrintingJobs(page = 1, limit = 10, status = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
  });

  return apiGet<any>(`/printing-jobs?${params}`);
}

export async function getPrintingJob(id: string) {
  return apiGet<any>(`/printing-jobs/${id}`);
}

export async function createPrintingJob(data: {
  customerId?: string;
  description: string;
  specifications?: string;
  expectedDeliveryDate?: string;
  quotedPrice?: number;
}) {
  return apiPost<any>('/printing-jobs', data);
}

export async function updatePrintingJobStatus(
  id: string,
  status: string,
  notes?: string
) {
  return apiPatch<any>(`/printing-jobs/${id}/status`, {
    status,
    notes,
  });
}

export async function setFinalPrice(id: string, finalPrice: number) {
  return apiPatch<any>(`/printing-jobs/${id}/price`, {
    finalPrice,
  });
}

export async function uploadJobFile(id: string, formData: FormData) {
  return apiFormData<any>(`/printing-jobs/${id}/files`, formData, 'POST');
}

export async function deleteJobFile(jobId: string, fileId: string) {
  return apiPost<any>(`/printing-jobs/${jobId}/files/${fileId}/delete`, {});
}
