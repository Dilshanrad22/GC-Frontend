'use server';

import { apiGet, apiPost, apiPatch } from '@/lib/api';

export async function getSuppliers(page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiGet(`/suppliers?${params}`);
}

export async function getSupplier(id: string) {
  return apiGet(`/suppliers/${id}`);
}

export async function createSupplier(data: {
  name: string;
  email: string;
  phone: string;
  city?: string;
  address?: string;
}) {
  return apiPost('/suppliers', data);
}

export async function updateSupplier(id: string, data: any) {
  return apiPatch(`/suppliers/${id}`, data);
}

export async function createPurchase(data: {
  supplierId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  expectedDeliveryDate?: string;
  notes?: string;
}) {
  return apiPost('/suppliers/purchases', data);
}

export async function getPurchases(supplierId?: string) {
  const params = new URLSearchParams({
    ...(supplierId && { supplierId }),
  });

  return apiGet(`/suppliers/purchases?${params}`);
}

export async function receivePurchaseItem(
  purchaseId: string,
  itemId: string,
  quantity: number
) {
  return apiPost(
    `/suppliers/purchases/${purchaseId}/items/${itemId}/receive`,
    {
      quantity,
    }
  );
}
