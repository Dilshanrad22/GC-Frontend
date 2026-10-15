'use server';

import { apiGet, apiPost, apiPatch } from '@/lib/api';

export async function getInventory(page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiGet<any>(`/inventory?${params}`);
}

export async function getInventoryItem(productId: string) {
  return apiGet<any>(`/inventory/${productId}`);
}

export async function getStockMovements(productId: string, page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiGet<any>(`/inventory/${productId}/movements?${params}`);
}

export async function getLowStockItems() {
  return apiGet<any>('/inventory/low-stock');
}

export async function setOpeningStock(
  productId: string,
  quantity: number,
  reason?: string
) {
  return apiPost<any>(`/inventory/${productId}/opening-stock`, {
    quantity,
    reason,
  });
}

export async function adjustStock(
  productId: string,
  quantity: number,
  type: 'increase' | 'decrease' | 'damaged' | 'customer_return',
  reason?: string
) {
  // The backend names the manual adjustments adjustment_increase / adjustment_decrease.
  const backendType =
    type === 'increase' ? 'adjustment_increase' : type === 'decrease' ? 'adjustment_decrease' : type;

  return apiPost<any>(`/inventory/${productId}/adjust`, {
    quantity,
    type: backendType,
    reason,
  });
}
