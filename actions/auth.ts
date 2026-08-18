'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiPost } from '@/lib/api';

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
  newPassword: string
) {
  try {
    const response = await apiPost<any>('/auth/change-password', {
      currentPassword,
      newPassword,
    });

    if (!response.success) {
      return {
        success: false,
        error: response.error?.message || 'Failed to change password',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('changePasswordAction failed:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
