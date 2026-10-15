import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Not Found</h1>
        <p className="text-sm text-slate-600 mb-6">
          The page or record you&apos;re looking for doesn&apos;t exist, or may have been removed.
        </p>
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
