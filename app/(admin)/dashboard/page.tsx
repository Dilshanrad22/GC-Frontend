import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { getSalesReport, getRevenueReport, getInventoryReport } from '@/actions/reports';
import { getProducts } from '@/actions/products';
import { getSales } from '@/actions/sales';
import { Package, Wallet, Plus, UserPlus, Receipt } from 'lucide-react';

async function DashboardPage() {
  const [salesReport, revenueReport, inventoryReport, productsResponse, recentSalesResponse, dueSalesResponse] =
    await Promise.all([
      getSalesReport(),
      getRevenueReport(),
      getInventoryReport(),
      getProducts(1, 12, '', '', 'active'),
      getSales(1, 5),
      getSales(1, 5, '', '', '', '', '', '', true),
    ]);

  const products = productsResponse?.data?.data || [];
  const recentSales = recentSalesResponse?.data?.data || [];
  const dueSales = dueSalesResponse?.data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Welcome to GC Business Management System</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/sales/new">
            <Button>
              <Receipt className="w-4 h-4" /> New Bill
            </Button>
          </Link>
          <Link href="/products/new">
            <Button variant="secondary">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
          <Link href="/customers/new">
            <Button variant="secondary">
              <UserPlus className="w-4 h-4" /> Add Customer
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {salesReport?.data?.totalSales || 0}
            </div>
            <p className="text-slate-600 text-sm">Today&apos;s Sales</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              Rs.{revenueReport?.data?.grossRevenue || 0}
            </div>
            <p className="text-slate-600 text-sm">Revenue</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {inventoryReport?.data?.totalItems || 0}
            </div>
            <p className="text-slate-600 text-sm">Products</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {inventoryReport?.data?.lowStockCount || 0}
            </div>
            <p className="text-slate-600 text-sm">Low Stock Items</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity" subtitle="Last 5 bills">
          {recentSales.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {recentSales.map((sale: any) => (
                <li key={sale.id}>
                  <Link
                    href={`/sales/${sale.id}`}
                    className="flex items-center justify-between py-2.5 text-sm hover:text-purple-600"
                  >
                    <span>
                      <span className="font-medium text-slate-900">{sale.invoiceNumber}</span>{' '}
                      <span className="text-slate-500">— {sale.customer?.name || 'Walk-in'}</span>
                    </span>
                    <span className="text-slate-700 font-medium">Rs.{sale.total}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600 text-sm">No bills yet — create your first one</p>
          )}
        </Card>

        <Card title="Alerts">
          <div className="space-y-2">
            <Link
              href="/products"
              className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 hover:bg-yellow-100 transition-colors"
            >
              <Package className="w-4 h-4 shrink-0" />
              {inventoryReport?.data?.lowStockCount || 0} items are low on stock
            </Link>
            <Link
              href="/sales?view=due"
              className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded text-sm text-purple-800 hover:bg-purple-100 transition-colors"
            >
              <Wallet className="w-4 h-4 shrink-0" />
              {dueSales.length} bill{dueSales.length === 1 ? '' : 's'} awaiting payment
            </Link>
          </div>
        </Card>
      </div>

      <Card title="Products" subtitle="Stock availability at a glance">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-600 py-8">No products found</p>
        )}
      </Card>
    </div>
  );
}

export default DashboardPage;
