'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Admin panel error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-sm text-slate-600 mb-6">
          This page ran into an unexpected error. You can try again, or go back to the dashboard.
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={() => reset()}>Try Again</Button>
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
