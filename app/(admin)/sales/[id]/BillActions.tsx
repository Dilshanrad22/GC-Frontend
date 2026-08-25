'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Printer, X } from 'lucide-react';

export function BillActions() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <Button onClick={() => window.print()}>
        <Printer className="w-4 h-4" /> Print Bill
      </Button>
      <Button variant="secondary" onClick={() => window.print()}>
        <Printer className="w-4 h-4" /> Reprint Bill
      </Button>
      <Button variant="ghost" onClick={() => router.back()}>
        <X className="w-4 h-4" /> Close
      </Button>
    </div>
  );
}
