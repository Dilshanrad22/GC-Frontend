'use server';

import { apiGet } from '@/lib/api';

export async function getAuditLogs(
  page = 1,
  limit = 10,
  userId?: string,
  action?: string,
  entityType?: string
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(userId && { userId }),
    ...(action && { action }),
    ...(entityType && { entityType }),
  });

  return apiGet(`/audit-logs?${params}`);
}

export async function getUserAuditLogs(userId: string, page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiGet(`/audit-logs/user/${userId}?${params}`);
}

export async function getEntityAuditLogs(
  entityType: string,
  entityId: string,
  page = 1,
  limit = 10
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiGet(
    `/audit-logs/entity/${entityType}/${entityId}?${params}`
  );
}
