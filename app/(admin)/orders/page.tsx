import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getOrders } from '@/actions/orders';
import Link from 'next/link';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function formatMoney(value: string | number) {
  return `Rs.${Number(value).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
  const status = query.status || '';
  const search = query.search?.trim() || '';

  const response = await getOrders(page, status, search);
  const orders = response?.data?.data || [];
  const pagination = response?.data?.pagination || { page: 1, totalPages: 1, total: 0 };

  // Keeps the active filter when moving between pages or tabs.
  const hrefFor = (overrides: { status?: string; page?: number }) => {
    const q = new URLSearchParams();
    const nextStatus = overrides.status ?? status;
    if (nextStatus) q.set('status', nextStatus);
    if (search) q.set('search', search);
    if (overrides.page && overrides.page > 1) q.set('page', String(overrides.page));
    const qs = q.toString();
    return qs ? `/orders?${qs}` : '/orders';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Web Orders</h1>
        <p className="text-slate-600">Orders placed on the online store</p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2 mb-4">
          {STATUS_TABS.map((tab) => (
            <Link
              key={tab.value || 'all'}
              href={hrefFor({ status: tab.value, page: 1 })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                status === tab.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <form action="/orders" method="get" className="mb-4 flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by order number, customer name or phone"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        {orders.length > 0 ? (
          <>
            <Table
              headers={['Order', 'Customer', 'Items', 'Total', 'Delivery', 'Status', 'Placed']}
              rows={orders.map((order: any) => [
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="font-medium text-purple-600 hover:underline"
                >
                  {order.orderNumber}
                </Link>,
                <div key="c">
                  <p className="font-medium text-slate-900">{order.customer?.name}</p>
                  <p className="text-xs text-slate-500">{order.customer?.phone}</p>
                </div>,
                order.itemCount,
                formatMoney(order.total),
                order.fulfillment === 'delivery' ? 'Delivery' : 'Pickup',
                <span
                  key="s"
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    statusStyles[order.status] || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {order.status}
                </span>,
                new Date(order.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              ])}
            />

            <div className="mt-4 flex justify-center items-center gap-2">
              {pagination.page > 1 && (
                <Link href={hrefFor({ page: pagination.page - 1 })}>
                  <Button variant="secondary" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.page < pagination.totalPages && (
                <Link href={hrefFor({ page: pagination.page + 1 })}>
                  <Button variant="secondary" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">No orders found</p>
        )}
      </Card>
    </div>
  );
}
