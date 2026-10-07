import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getCustomerProfile } from '@/actions/customers';
import { getSales } from '@/actions/sales';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Wallet,
  ShoppingBag,
  Receipt,
  Calendar,
  Package,
} from 'lucide-react';

function formatMoney(value: number) {
  return `Rs.${Number(value).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getLast12Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

function MonthlySpendChart({ monthlySummary }: { monthlySummary: { month: string; orders: number; total: number }[] }) {
  const summaryMap = new Map(monthlySummary.map((m) => [m.month, m]));
  const chartData = getLast12Months().map((key) => {
    const entry = summaryMap.get(key);
    const [year, month] = key.split('-');
    const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-US', {
      month: 'short',
    });
    return { key, label, total: entry?.total || 0, orders: entry?.orders || 0 };
  });
  const maxTotal = Math.max(...chartData.map((d) => d.total), 1);

  return (
    <div className="flex items-end gap-1.5 sm:gap-2.5 h-40">
      {chartData.map((d) => {
        const heightPct = (d.total / maxTotal) * 100;
        return (
          <div
            key={d.key}
            className="flex-1 flex flex-col items-center gap-1.5"
            title={`${d.label}: ${formatMoney(d.total)} (${d.orders} order${d.orders === 1 ? '' : 's'})`}
          >
            <div className="w-full flex items-end h-32">
              <div
                className="w-full bg-purple-500 rounded-t transition-all"
                style={{ height: d.total > 0 ? `${Math.max(heightPct, 4)}%` : '0%' }}
              />
            </div>
            <span className="text-[10px] text-slate-500">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default async function CustomerProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    paymentMethod?: string;
  }>;
}) {
  const { id } = await params;
  const {
    page: pageParam,
    search: searchParam,
    dateFrom = '',
    dateTo = '',
    paymentMethod = '',
  } = await searchParams;
  const page = parseInt(pageParam || '1');
  const search = searchParam || '';

  const [profileResponse, salesResponse] = await Promise.all([
    getCustomerProfile(id),
    getSales(page, 10, '', dateFrom, dateTo, id, search, paymentMethod),
  ]);

  if (!profileResponse?.success || !profileResponse?.data) {
    notFound();
  }

  const { customer, stats, monthlySummary } = profileResponse.data;
  const sales = salesResponse?.data?.data || [];
  const pagination = salesResponse?.data?.pagination || {};
  const hasFilters = Boolean(search || dateFrom || dateTo || paymentMethod);

  const filterQuery = (overrides: Record<string, string> = {}) => {
    const merged = { search, dateFrom, dateTo, paymentMethod, ...overrides };
    const qs = new URLSearchParams();
    Object.entries(merged).forEach(([key, value]) => {
      if (value) qs.set(key, value);
    });
    return qs.toString();
  };

  return (
    <div className="space-y-6">
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-purple-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </Link>

      <Card title="Customer Information">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Name</p>
            <p className="text-slate-900 font-medium">{customer.name}</p>
          </div>
          <div>
            <p className="text-slate-400">Phone</p>
            <p className="text-slate-900 font-medium">{customer.phone}</p>
          </div>
          <div>
            <p className="text-slate-400">Email</p>
            <p className="text-slate-900 font-medium">{customer.email || '-'}</p>
          </div>
          <div>
            <p className="text-slate-400">Address</p>
            <p className="text-slate-900 font-medium">{customer.address || '-'}</p>
          </div>
          <div>
            <p className="text-slate-400">Customer Type</p>
            <p className="text-slate-900 font-medium capitalize">{customer.customerType}</p>
          </div>
          <div>
            <p className="text-slate-400">City / District</p>
            <p className="text-slate-900 font-medium">{customer.cityDistrict || '-'}</p>
          </div>
          <div>
            <p className="text-slate-400">Registered</p>
            <p className="text-slate-900 font-medium">
              {new Date(customer.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4.5 h-4.5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{stats.totalOrders}</p>
              <p className="text-xs text-slate-500">Total Purchases</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <Wallet className="w-4.5 h-4.5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{formatMoney(stats.totalSpent)}</p>
              <p className="text-xs text-slate-500">Total Spent</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Receipt className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{formatMoney(stats.averageBillValue)}</p>
              <p className="text-xs text-slate-500">Avg Bill Value</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              <Calendar className="w-4.5 h-4.5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {stats.lastPurchaseDate
                  ? new Date(stats.lastPurchaseDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '-'}
              </p>
              <p className="text-xs text-slate-500">Last Purchase</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Package className="w-4.5 h-4.5 text-slate-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{stats.totalItemsPurchased}</p>
              <p className="text-xs text-slate-500">Items Purchased</p>
            </div>
          </div>
        </Card>
      </div>

      {monthlySummary?.length > 0 && (
        <Card title="Monthly Spend" subtitle="Last 12 months">
          <MonthlySpendChart monthlySummary={monthlySummary} />
        </Card>
      )}

      <Card title="Purchase History">
        <form action={`/customers/${id}`} method="get" className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search by bill #..."
            defaultValue={search}
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
          <input
            type="date"
            name="dateFrom"
            defaultValue={dateFrom}
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
          <input
            type="date"
            name="dateTo"
            defaultValue={dateTo}
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
          <div className="flex gap-2">
            <select
              name="paymentMethod"
              defaultValue={paymentMethod}
              className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            >
              <option value="">All Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="check">Check</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
            <Button type="submit" size="md">
              Filter
            </Button>
          </div>
        </form>

        {hasFilters && (
          <Link
            href={`/customers/${id}`}
            className="inline-block mb-4 text-sm text-purple-600 hover:underline"
          >
            Clear Filters
          </Link>
        )}

        {sales.length > 0 ? (
          <>
            <Table
              headers={['Date', 'Bill #', 'Items', 'Total', 'Payment', 'Cashier', 'Status', '']}
              rows={sales.map((sale: any) => [
                new Date(sale.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }),
                sale.invoiceNumber,
                sale._count?.items ?? '-',
                formatMoney(sale.total),
                <span key={`${sale.id}-pm`} className="capitalize">
                  {sale.paymentMethod?.replace('_', ' ')}
                </span>,
                sale.cashier?.fullName || '-',
                sale.status === 'voided' ? (
                  <span key={`${sale.id}-status`} className="text-red-600 font-medium">
                    Voided
                  </span>
                ) : (
                  <span key={`${sale.id}-status`} className="text-green-600 font-medium capitalize">
                    {sale.status}
                  </span>
                ),
                <Link
                  key={`${sale.id}-view`}
                  href={`/sales/${sale.id}`}
                  className="text-purple-600 hover:underline"
                >
                  View Details
                </Link>,
              ])}
            />

            <div className="mt-4 flex justify-center gap-2">
              {pagination.page > 1 && (
                <Link href={`/customers/${id}?${filterQuery({ page: String(page - 1) })}`}>
                  <Button variant="secondary" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.page < pagination.totalPages && (
                <Link href={`/customers/${id}?${filterQuery({ page: String(page + 1) })}`}>
                  <Button variant="secondary" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">
            {hasFilters
              ? 'No purchases match these filters.'
              : 'No purchase history available for this customer.'}
          </p>
        )}
      </Card>
    </div>
  );
}
