import { cookies } from 'next/headers';

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role?: { name: string };
}

// Server-side counterpart to the client-side cookie read in navbar.tsx —
// use this from Server Components/pages that need the role before rendering
// (e.g. to decide whether to show an admin-only control).
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get('user')?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role?.name === 'admin';
}
