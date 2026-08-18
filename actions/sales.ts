'use server';

import { apiGet, apiPost, apiPatch } from '@/lib/api';

export async function getSales(page = 1, limit = 10, status = '', dateFrom = '', dateTo = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
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
    price: number;
    discount?: number;
  }>;
  discountAmount?: number;
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
