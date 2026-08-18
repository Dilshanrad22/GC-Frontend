'use server';

import { apiGet, apiPost, apiPatch } from '@/lib/api';

export async function getInvoices(page = 1, limit = 10, status = '', customerId = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
    ...(customerId && { customerId }),
  });

  return apiGet(`/invoices?${params}`);
}

export async function getInvoice(id: string) {
  return apiGet(`/invoices/${id}`);
}

export async function getDueInvoices() {
  return apiGet('/invoices/due');
}

export async function getInvoicesByCustomer(customerId: string) {
  return apiGet(`/invoices/customer/${customerId}`);
}

export async function recordPayment(
  invoiceId: string,
  amount: number,
  paymentMethod: string,
  notes?: string
) {
  return apiPost(`/invoices/${invoiceId}/payments`, {
    amount,
    paymentMethod,
    notes,
  });
}
