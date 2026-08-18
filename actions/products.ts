'use server';

import { apiGet, apiPost, apiPatch, apiFormData } from '@/lib/api';

export async function getProducts(page = 1, limit = 10, search = '', category = '', status = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(category && { category }),
    ...(status && { status }),
  });

  return apiGet<any>(`/products?${params}`);
}

export async function getProduct(id: string) {
  return apiGet<any>(`/products/${id}`);
}

export async function createProduct(data: {
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  unit: string;
  buyingPrice: number;
  sellingPrice: number;
  minimumStock?: number;
  barcode?: string;
  brand?: string;
}) {
  return apiPost<any>('/products', data);
}

export async function updateProduct(id: string, data: any) {
  return apiPatch<any>(`/products/${id}`, data);
}

export async function uploadProductImage(id: string, formData: FormData) {
  return apiFormData<any>(`/products/${id}/images`, formData, 'POST');
}

export async function deleteProductImage(productId: string, imageId: string) {
  return apiPost<any>(`/products/${productId}/images/${imageId}/delete`, {});
}

export async function deactivateProduct(id: string) {
  return apiPatch<any>(`/products/${id}/deactivate`, {});
}

export async function getCategories() {
  return apiGet<any>('/categories');
}

export async function createCategory(data: {
  name: string;
  description?: string;
  parentId?: string;
}) {
  return apiPost<any>('/categories', data);
}

export async function updateCategory(id: string, data: any) {
  return apiPatch<any>(`/categories/${id}`, data);
}
