'use server';

import { apiGet, apiPost, apiPatch } from '@/lib/api';

export async function getSales(
  page = 1,
  limit = 10,
  status = '',
  dateFrom = '',
  dateTo = '',
  customerId = '',
  search = '',
  paymentMethod = '',
  dueOnly = false
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
    // Backend expects full ISO datetimes; date-only inputs (e.g. from
    // <input type="date">) are widened to start/end of day.
    ...(dateFrom && { startDate: new Date(`${dateFrom}T00:00:00.000Z`).toISOString() }),
    ...(dateTo && { endDate: new Date(`${dateTo}T23:59:59.999Z`).toISOString() }),
    ...(customerId && { customerId }),
    ...(search && { search }),
    ...(paymentMethod && { paymentMethod }),
    ...(dueOnly && { paymentStatus: 'due' }),
  });

  return apiGet<any>(`/sales?${params}`);
}

export async function getSale(id: string) {
  return apiGet<any>(`/sales/${id}`);
}

export async function createSale(data: {
  customerId?: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }>;
  discount?: number;
  tax?: number;
  paymentMethod: string;
  notes?: string;
}) {
  return apiPost<any>('/sales', data);
}

export async function voidSale(id: string, reason: string) {
  return apiPost<any>(`/sales/${id}/void`, { reason });
}

export async function returnSaleItem(
  saleId: string,
  itemId: string,
  quantity: number,
  reason: string
) {
  return apiPost<any>(`/sales/${saleId}/return`, {
    itemId,
    quantity,
    reason,
  });
}

export async function getReceipt(saleId: string) {
  return apiGet<any>(`/receipts/${saleId}/preview`);
}
