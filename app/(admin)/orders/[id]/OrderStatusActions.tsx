'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { updateOrderStatus } from '@/actions/orders';

// Mirrors the transitions enforced by the backend (orders.service.ts).
const NEXT_ACTIONS: Record<string, { status: string; label: string; variant: 'success' | 'danger' }[]> = {
  pending: [
    { status: 'confirmed', label: 'Confirm order', variant: 'success' },
    { status: 'cancelled', label: 'Cancel order', variant: 'danger' },
  ],
  confirmed: [
    { status: 'completed', label: 'Mark as completed', variant: 'success' },
    { status: 'cancelled', label: 'Cancel order', variant: 'danger' },
  ],
  completed: [],
  cancelled: [],
};

export function OrderStatusActions({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const actions = NEXT_ACTIONS[status] || [];

  if (actions.length === 0) {
    return <p className="text-sm text-slate-600">This order is {status}. No further changes.</p>;
  }

  function run(next: string) {
    if (next === 'cancelled') {
      const message =
        status === 'confirmed'
          ? 'Cancel this order? The items will be returned to stock.'
          : 'Cancel this order?';
      if (!window.confirm(message)) return;
    }

    setError(null);
    startTransition(async () => {
      const response = await updateOrderStatus(orderId, next);
      if (!response?.success) {
        setError(response?.error?.message || 'Could not update the order');
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <Button
            key={action.status}
            variant={action.variant}
            disabled={isPending}
            onClick={() => run(action.status)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}
    </div>
  );
}
