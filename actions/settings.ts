'use server';

import { apiGet, apiPatch } from '@/lib/api';

export interface BusinessSettings {
  businessName: string;
  registrationNumber: string | null;
  address: string | null;
  phone: string | null;
  updatedAt: string;
}

export async function getBusinessSettings() {
  return apiGet<BusinessSettings>('/settings/business');
}

export async function updateBusinessSettingsAction(data: {
  businessName: string;
  registrationNumber: string;
  address: string;
  phone: string;
}) {
  try {
    const response = await apiPatch<BusinessSettings>('/settings/business', {
      businessName: data.businessName,
      registrationNumber: data.registrationNumber || null,
      address: data.address || null,
      phone: data.phone || null,
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error?.message || 'Failed to update business information',
      };
    }

    return { success: true, settings: response.data };
  } catch (error) {
    console.error('updateBusinessSettingsAction failed:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
