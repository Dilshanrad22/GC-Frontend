'use server';

import { apiGet, apiPost, apiPatch } from '@/lib/api';

export async function getExpenses(page = 1, limit = 10, status = '', category = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
    ...(category && { category }),
  });

  return apiGet<any>(`/expenses?${params}`);
}

export async function getExpense(id: string) {
  return apiGet<any>(`/expenses/${id}`);
}

export async function createExpense(data: {
  description: string;
  amount: number;
  category: string;
  date: string;
  attachment?: string;
  notes?: string;
}) {
  return apiPost<any>('/expenses', data);
}

export async function updateExpense(id: string, data: any) {
  return apiPatch<any>(`/expenses/${id}`, data);
}

export async function approveExpense(id: string) {
  return apiPost<any>(`/expenses/${id}/approve`, {});
}

export async function getExpensesSummary(
  dateFrom?: string,
  dateTo?: string,
  category?: string
) {
  const params = new URLSearchParams({
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
    ...(category && { category }),
  });

  return apiGet<any>(`/expenses/summary?${params}`);
}
