'use server';

import { apiGet } from '@/lib/api';

export async function getSalesReport(
  dateFrom?: string,
  dateTo?: string,
  period?: 'daily' | 'weekly' | 'monthly'
) {
  const params = new URLSearchParams({
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
    ...(period && { period }),
  });

  return apiGet<any>(`/reports/sales?${params}`);
}

export async function getRevenueReport(
  dateFrom?: string,
  dateTo?: string,
  period?: 'daily' | 'weekly' | 'monthly'
) {
  const params = new URLSearchParams({
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
    ...(period && { period }),
  });

  return apiGet<any>(`/reports/revenue?${params}`);
}

export async function getProductSalesReport(dateFrom?: string, dateTo?: string) {
  const params = new URLSearchParams({
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  });

  return apiGet<any>(`/reports/products?${params}`);
}

export async function getInventoryReport() {
  return apiGet<any>('/reports/inventory');
}

export async function getCustomerReport(dateFrom?: string, dateTo?: string) {
  const params = new URLSearchParams({
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  });

  return apiGet<any>(`/reports/customers?${params}`);
}

export async function getPrintingJobsReport(
  dateFrom?: string,
  dateTo?: string
) {
  const params = new URLSearchParams({
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  });

  return apiGet<any>(`/reports/printing-jobs?${params}`);
}
