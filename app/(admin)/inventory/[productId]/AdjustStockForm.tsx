'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adjustStock } from '@/actions/inventory';

const selectClass =
  'w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500';

export function AdjustStockForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({ quantity: '', type: 'increase', reason: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const quantity = Number(form.quantity);
    if (!quantity || quantity <= 0) {
      setMessage({ type: 'error', text: 'Enter a quantity greater than zero' });
      return;
    }
    if (!form.reason.trim()) {
      setMessage({ type: 'error', text: 'A reason is required' });
      return;
    }

    startTransition(async () => {
      const response = await adjustStock(
        productId,
        quantity,
        form.type as 'increase' | 'decrease' | 'damaged' | 'customer_return',
        form.reason
      );
      if (!response?.success) {
        setMessage({ type: 'error', text: response?.error?.message || 'Could not adjust stock' });
        return;
      }
      setForm({ quantity: '', type: 'increase', reason: '' });
      setMessage({ type: 'ok', text: 'Stock updated' });
      router.refresh();
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

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity"
          type="number"
          min={1}
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={selectClass}
          >
            <option value="increase">Increase</option>
            <option value="decrease">Decrease</option>
            <option value="damaged">Damaged</option>
            <option value="customer_return">Customer Return</option>
          </select>
        </div>
      </div>

      <Input
        label="Reason"
        placeholder="Why is stock being adjusted?"
        value={form.reason}
        onChange={(e) => setForm({ ...form, reason: e.target.value })}
        required
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Adjust Stock'}
      </Button>
    </form>
  );
}
