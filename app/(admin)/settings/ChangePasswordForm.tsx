'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { changePasswordAction } from '@/actions/auth';

export function ChangePasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match' });
      return;
    }

    startTransition(async () => {
      const result = await changePasswordAction(
        form.currentPassword,
        form.newPassword,
        form.confirmPassword
      );
      if (!result.success) {
        setMessage({ type: 'error', text: result.error || 'Failed to change password' });
        return;
      }
      // Backend revoked this session's tokens; send the user back to login.
      router.push('/login');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <p className="text-sm rounded-lg px-3 py-2 border text-red-600 bg-red-50 border-red-200">
          {message.text}
        </p>
      )}
      <Input
        label="Current Password"
        type="password"
        value={form.currentPassword}
        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        required
      />
      <Input
        label="New Password"
        type="password"
        value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        helperText="At least 8 characters, with an uppercase letter, a lowercase letter, and a number"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        required
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  );
}
