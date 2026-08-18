'use server';

import { apiGet, apiPost, apiPatch } from '@/lib/api';

export async function getInvoices(page = 1, limit = 10, status = '', customerId = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
    ...(customerId && { customerId }),
  });

  return apiGet<any>(`/invoices?${params}`);
}

export async function getInvoice(id: string) {
  return apiGet<any>(`/invoices/${id}`);
}

export async function getDueInvoices() {
  return apiGet<any>('/invoices/due');
}

export async function getInvoicesByCustomer(customerId: string) {
  return apiGet<any>(`/invoices/customer/${customerId}`);
}

export async function recordPayment(
  invoiceId: string,
  amount: number,
  paymentMethod: string,
  notes?: string
) {
  return apiPost<any>(`/invoices/${invoiceId}/payments`, {
    amount,
    paymentMethod,
    notes,
  });
}
