import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getSales } from '@/actions/sales';
import Link from 'next/link';
import { Plus } from 'lucide-react';

async function SalesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const response = await getSales(page, 10);
  const sales = response?.data?.data || [];
  const pagination = response?.data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales</h1>
          <p className="text-slate-600">View and manage sales transactions</p>
        </div>
        <Link href="/sales/new">
          <Button>
            <Plus className="w-4 h-4" /> New Sale
          </Button>
        </Link>
      </div>

      <Card>
        {sales.length > 0 ? (
          <>
            <Table
              headers={[
                'Invoice #',
                'Customer',
                'Total',
                'Items',
                'Date',
                'Status',
              ]}
              rows={sales.map((sale: any) => [
                <Link
                  key={sale.id}
                  href={`/sales/${sale.id}`}
                  className="text-purple-600 hover:underline font-medium"
                >
                  {sale.invoiceNumber}
                </Link>,
                sale.customer?.name || 'Walk-in',
                `Rs.${sale.totalAmount}`,
                sale.items?.length || 0,
                new Date(sale.createdAt).toLocaleDateString(),
                <span key={`${sale.id}-status`} className="text-green-600 font-medium">Completed</span>,
              ])}
            />

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
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">No sales found</p>
        )}
      </Card>
    </div>
  );
}

export default SalesPage;
