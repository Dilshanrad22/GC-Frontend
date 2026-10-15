import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import {
  getSalesTrend,
  getProductSalesReport,
  getInventoryReport,
  getCustomerReport,
} from '@/actions/reports';
import { DownloadReportButton } from './DownloadReportButton';
import Link from 'next/link';

function formatMoney(value: number) {
  return `Rs.${Number(value).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function TrendChart({ points }: { points: { label: string; total: number; transactions: number }[] }) {
  if (points.length === 0) {
    return <p className="text-slate-600 text-sm py-8 text-center">No sales recorded in this period yet</p>;
  }

  const maxTotal = Math.max(...points.map((p) => p.total), 1);

  return (
    <div className="flex items-end gap-1 sm:gap-2 h-48 overflow-x-auto">
      {points.map((p) => {
        const heightPct = (p.total / maxTotal) * 100;
        return (
          <div
            key={p.label}
            className="flex-1 min-w-7 flex flex-col items-center gap-1.5"
            title={`${p.label}: ${formatMoney(p.total)} (${p.transactions} sale${p.transactions === 1 ? '' : 's'})`}
          >
            <div className="w-full flex items-end h-36">
              <div
                className="w-full bg-purple-500 rounded-t transition-all"
                style={{ height: p.total > 0 ? `${Math.max(heightPct, 4)}%` : '0%' }}
              />
            </div>
            <span className="text-[10px] text-slate-500 whitespace-nowrap">{p.label}</span>
          </div>
        );
      })}
    </div>
  );
}

async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const query = await searchParams;
  const period = query.period === 'weekly' || query.period === 'monthly' ? query.period : 'daily';

  const [trendResponse, productsResponse, inventoryResponse, customersResponse] = await Promise.all([
    getSalesTrend(period),
    getProductSalesReport(),
    getInventoryReport(),
    getCustomerReport(),
  ]);

  const trend = trendResponse?.data;
  const points = trend?.points || [];
  const topProducts = productsResponse?.data?.topProducts || [];
  const inventoryItems = inventoryResponse?.data?.items || [];
  const lowStockItems = inventoryItems.filter((i: any) => i.status !== 'ok');
  const topCustomers = customersResponse?.data?.topCustomers || [];

  const totalSales = points.reduce((sum: number, p: any) => sum + p.total, 0);
  const totalTransactions = points.reduce((sum: number, p: any) => sum + p.transactions, 0);
  const averageSale = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600">How the shop is doing, at a glance</p>
        </div>
        <DownloadReportButton
          period={period}
          trendPoints={points}
          topProducts={topProducts}
          lowStockItems={lowStockItems}
          topCustomers={topCustomers}
        />
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-base font-semibold text-slate-900">Sales Trend</h2>
          <div className="flex gap-2">
            <Link href="/reports?period=daily">
              <Button variant={period === 'daily' ? 'primary' : 'secondary'} size="sm">
                Daily
              </Button>
            </Link>
            <Link href="/reports?period=weekly">
              <Button variant={period === 'weekly' ? 'primary' : 'secondary'} size="sm">
                Weekly
              </Button>
            </Link>
            <Link href="/reports?period=monthly">
              <Button variant={period === 'monthly' ? 'primary' : 'secondary'} size="sm">
                Monthly
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{formatMoney(totalSales)}</div>
            <p className="text-slate-500 text-xs">Total Sales</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{totalTransactions}</div>
            <p className="text-slate-500 text-xs">Bills Created</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{formatMoney(averageSale)}</div>
            <p className="text-slate-500 text-xs">Average Bill</p>
          </div>
        </div>

        <TrendChart points={points} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top Products" subtitle="Best sellers in the last year">
          {topProducts.length > 0 ? (
            <Table
              headers={['Product', 'Qty Sold', 'Revenue']}
              rows={topProducts
                .slice(0, 8)
                .map((p: any) => [p.productName, p.quantity, formatMoney(p.revenue)])}
            />
          ) : (
            <p className="text-slate-600 text-sm py-4 text-center">No product sales yet</p>
          )}
        </Card>

        <Card title="Low Stock Alerts" subtitle="Products at or below their minimum level">
          {lowStockItems.length > 0 ? (
            <Table
              headers={['Product', 'In Stock', 'Minimum']}
              rows={lowStockItems
                .slice(0, 8)
                .map((i: any) => [i.productName, i.currentStock, i.minimumStock])}
            />
          ) : (
            <p className="text-slate-600 text-sm py-4 text-center">Everything is well stocked</p>
          )}
        </Card>
      </div>

      <Card title="Top Customers" subtitle="By total amount spent">
        {topCustomers.length > 0 ? (
          <Table
            headers={['Customer', 'Orders', 'Total Spent', 'Outstanding']}
            rows={topCustomers
              .slice(0, 8)
              .map((c: any) => [
                c.name,
                c.totalTransactions,
                formatMoney(c.totalSpent),
                c.outstanding > 0 ? (
                  <span className="text-red-600 font-medium">{formatMoney(c.outstanding)}</span>
                ) : (
                  '-'
                ),
              ])}
          />
        ) : (
          <p className="text-slate-600 text-sm py-4 text-center">No customers yet</p>
        )}
      </Card>
    </div>
  );
}

export default ReportsPage;
