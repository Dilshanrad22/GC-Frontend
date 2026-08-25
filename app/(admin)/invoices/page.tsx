import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getInvoices, getDueInvoices } from '@/actions/invoices';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

async function InvoicesPage({
  searchParams,
}: {
  searchParams: { view?: string; page?: string };
}) {
  const view = searchParams.view || 'all';
  const page = parseInt(searchParams.page || '1');

  let response;
  if (view === 'due') {
    response = await getDueInvoices();
  } else {
    response = await getInvoices(page, 10);
  }

  const invoices = response?.data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
        <p className="text-slate-600">Manage customer invoices and payments</p>
      </div>

      <div className="flex gap-2">
        <Link href="/invoices?view=all">
          <Button variant={view === 'all' ? 'primary' : 'secondary'}>
            All
          </Button>
        </Link>
        <Link href="/invoices?view=due">
          <Button variant={view === 'due' ? 'primary' : 'secondary'}>
            <AlertTriangle className="w-4 h-4" /> Due
          </Button>
        </Link>
      </div>

      <Card>
        {invoices.length > 0 ? (
          <Table
            headers={['Invoice #', 'Customer', 'Amount', 'Paid', 'Status', 'Date']}
            rows={invoices.map((inv: any) => [
              <Link
                key={inv.id}
                href={`/invoices/${inv.id}`}
                className="text-purple-600 hover:underline"
              >
                {inv.number}
              </Link>,
              inv.customer?.name || '-',
              `Rs.${inv.totalAmount}`,
              `Rs.${inv.paidAmount || 0}`,
              inv.status === 'paid' ? (
                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Paid
                </span>
              ) : inv.status === 'partial' ? (
                <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                  <Clock className="w-4 h-4" /> Partial
                </span>
              ) : (
                <span className="text-red-600 font-medium">Pending</span>
              ),
              new Date(inv.createdAt).toLocaleDateString(),
            ])}
          />
        ) : (
          <p className="text-center text-slate-600 py-8">No invoices found</p>
        )}
      </Card>
    </div>
  );
}

export default InvoicesPage;
