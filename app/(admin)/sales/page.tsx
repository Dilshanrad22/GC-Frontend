import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getSales } from '@/actions/sales';
import Link from 'next/link';
import { Plus, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const statusBadge: Record<string, React.ReactElement> = {
  paid: (
    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
      <CheckCircle2 className="w-4 h-4" /> Paid
    </span>
  ),
  partial: (
    <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
      <Clock className="w-4 h-4" /> Partial
    </span>
  ),
  pending: <span className="text-red-600 font-medium">Due</span>,
};

async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; view?: string }>;
}) {
  const query = await searchParams;
  const page = parseInt(query.page || '1');
  const view = query.view === 'due' ? 'due' : 'all';
  const response = await getSales(page, 10, '', '', '', '', '', '', view === 'due');
  const sales = response?.data?.data || [];
  const pagination = response?.data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Billing</h1>
          <p className="text-slate-600">Create bills and track payments</p>
        </div>
        <Link href="/sales/new">
          <Button>
            <Plus className="w-4 h-4" /> New Bill
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Link href="/sales?view=all">
          <Button variant={view === 'all' ? 'primary' : 'secondary'}>All</Button>
        </Link>
        <Link href="/sales?view=due">
          <Button variant={view === 'due' ? 'primary' : 'secondary'}>
            <AlertTriangle className="w-4 h-4" /> Due
          </Button>
        </Link>
      </div>

      <Card>
        {sales.length > 0 ? (
          <>
            <Table
              headers={['Invoice #', 'Customer', 'Total', 'Items', 'Date', 'Status']}
              rows={sales.map((sale: any) => [
                <Link
                  key={sale.id}
                  href={`/sales/${sale.id}`}
                  className="text-purple-600 hover:underline font-medium"
                >
                  {sale.invoiceNumber}
                </Link>,
                sale.customer?.name || sale.customerName || 'Walk-in',
                `Rs.${sale.total}`,
                sale._count?.items ?? sale.items?.length ?? 0,
                new Date(sale.createdAt).toLocaleDateString(),
                statusBadge[sale.paymentStatus] || statusBadge.pending,
              ])}
            />

            {view === 'all' && (
              <div className="mt-4 flex justify-center gap-2">
                {pagination.page > 1 && (
                  <Link href={`/sales?page=${page - 1}`}>
                    <Button variant="secondary" size="sm">
                      Previous
                    </Button>
                  </Link>
                )}
                <span className="px-4 py-2 text-sm text-slate-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                {pagination.page < pagination.totalPages && (
                  <Link href={`/sales?page=${page + 1}`}>
                    <Button variant="secondary" size="sm">
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">
            {view === 'due' ? 'No outstanding bills — everything is paid up' : 'No bills found'}
          </p>
        )}
      </Card>
    </div>
  );
}

export default SalesPage;
