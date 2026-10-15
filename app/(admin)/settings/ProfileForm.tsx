'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateProfileAction } from '@/actions/auth';

interface Props {
  user: { fullName: string; email: string; phone: string | null };
}

export function ProfileForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({ fullName: user.fullName, phone: user.phone ?? '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateProfileAction(form.fullName, form.phone);
      if (!result.success) {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
        return;
      }
      setMessage({ type: 'ok', text: 'Profile updated' });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <p
          className={`text-sm rounded-lg px-3 py-2 border ${
            message.type === 'ok'
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-red-600 bg-red-50 border-red-200'
          }`}
        >
          {message.text}
        </p>
      )}
      <Input
        label="Full Name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        required
      />
      <Input label="Email" type="email" value={user.email} disabled helperText="Email can't be changed here" />
      <Input
        label="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}
