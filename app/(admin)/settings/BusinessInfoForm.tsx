'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateBusinessSettingsAction, type BusinessSettings } from '@/actions/settings';

export function BusinessInfoForm({ settings }: { settings: BusinessSettings }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    businessName: settings.businessName,
    registrationNumber: settings.registrationNumber ?? '',
    address: settings.address ?? '',
    phone: settings.phone ?? '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateBusinessSettingsAction(form);
      if (!result.success) {
        setMessage({ type: 'error', text: result.error || 'Failed to save business information' });
        return;
      }
      setMessage({ type: 'ok', text: 'Business information saved' });
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
        label="Business Name"
        value={form.businessName}
        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
        required
      />
      <Input
        label="Registration Number"
        value={form.registrationNumber}
        onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
      />
      <Input
        label="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <Input
        label="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Business Info'}
      </Button>
    </form>
  );
}
