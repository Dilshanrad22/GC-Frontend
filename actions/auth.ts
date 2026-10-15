'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiPost, apiPatch, apiGet } from '@/lib/api';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  isActive: boolean;
}

export async function getProfile() {
  return apiGet<Profile>('/auth/me');
}

export async function loginAction(email: string, password: string) {
  try {
    const response = await apiPost<{
      accessToken: string;
      refreshToken: string;
      user: {
        id: string;
        fullName: string;
        email: string;
        role: {
          name: string;
        };
      };
    }>('/auth/login', { email, password });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error?.message || 'Login failed',
      };
    }

    const cookieStore = await cookies();
    cookieStore.set('accessToken', response.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 900,
    });

    cookieStore.set('refreshToken', response.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 604800,
    });

    cookieStore.set('user', JSON.stringify(response.data.user), {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 900,
    });

    return { success: true, user: response.data.user };
  } catch (error) {
    console.error('loginAction failed:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('user');
  redirect('/login');
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  try {
    const response = await apiPatch<any>('/auth/change-password', {
      oldPassword: currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!response.success) {
      return {
        success: false,
        error: response.error?.message || 'Failed to change password',
      };
    }

    // The backend revokes every refresh token on password change, so this
    // session's tokens are now invalid — clear cookies and force re-login.
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('user');

    return { success: true };
  } catch (error) {
    console.error('changePasswordAction failed:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function updateProfileAction(fullName: string, phone: string) {
  try {
    const response = await apiPatch<{
      id: string;
      fullName: string;
      email: string;
      phone: string | null;
      role: string;
    }>('/auth/me', { fullName, phone: phone || null });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error?.message || 'Failed to update profile',
      };
    }

    // Keep the readable `user` cookie in sync with the new name.
    const cookieStore = await cookies();
    const existingRaw = cookieStore.get('user')?.value;
    const existing = existingRaw ? JSON.parse(existingRaw) : {};
    cookieStore.set(
      'user',
      JSON.stringify({ ...existing, fullName: response.data.fullName }),
      {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 900,
      }
    );

    return { success: true, profile: response.data };
  } catch (error) {
    console.error('updateProfileAction failed:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
