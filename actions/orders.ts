'use server';

import { apiGet, apiPatch } from '@/lib/api';

export async function getOrders(page = 1, status = '', search = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '15',
    ...(status && { status }),
    ...(search && { search }),
  });

  return apiGet<any>(`/orders?${params}`);
}

export async function getOrder(id: string) {
  return apiGet<any>(`/orders/${id}`);
}

export async function updateOrderStatus(id: string, status: string) {
  return apiPatch<any>(`/orders/${id}/status`, { status });
}
