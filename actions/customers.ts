'use server';

import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

export async function getCustomers(page = 1, limit = 10, search = '', type = '', city = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(type && { type }),
    ...(city && { city }),
  });

  return apiGet<any>(`/customers?${params}`);
}

export async function getCustomer(id: string) {
  return apiGet<any>(`/customers/${id}`);
}

export async function getCustomerProfile(id: string) {
  return apiGet<any>(`/customers/${id}/profile`);
}

export async function createCustomer(data: {
  name: string;
  email: string;
  phone: string;
  type: string;
  city?: string;
  address?: string;
}) {
  return apiPost<any>('/customers', data);
}

export async function updateCustomer(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    type?: string;
    city?: string;
    address?: string;
  }
) {
  return apiPatch<any>(`/customers/${id}`, data);
}

export async function deactivateCustomer(id: string) {
  return apiPatch<any>(`/customers/${id}/deactivate`, {});
}

export async function reactivateCustomer(id: string) {
  return apiPatch<any>(`/customers/${id}/reactivate`, {});
}
