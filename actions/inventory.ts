'use server';

import { apiGet, apiPost, apiPatch } from '@/lib/api';

export async function getInventory(page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiGet(`/inventory?${params}`);
}

export async function getInventoryItem(productId: string) {
  return apiGet(`/inventory/${productId}`);
}

export async function getStockMovements(productId: string, page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiGet(`/inventory/${productId}/movements?${params}`);
}

export async function getLowStockItems() {
  return apiGet('/inventory/low-stock');
}

export async function setOpeningStock(
  productId: string,
  quantity: number,
  reason?: string
) {
  return apiPost(`/inventory/${productId}/opening-stock`, {
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
  return apiPost(`/inventory/${productId}/adjust`, {
    quantity,
    type,
    reason,
  });
}
