import { Card } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { getSalesReport, getRevenueReport, getInventoryReport } from '@/actions/reports';
import { getProducts } from '@/actions/products';
import { Package, Wallet } from 'lucide-react';

async function DashboardPage() {
  const [salesReport, revenueReport, inventoryReport, productsResponse] = await Promise.all([
    getSalesReport(),
    getRevenueReport(),
    getInventoryReport(),
    getProducts(1, 12, '', '', 'active'),
  ]);

  const products = productsResponse?.data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome to GC Business Management System</p>
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
        <Card title="Recent Activity">
          <p className="text-slate-600 text-sm">
            Monitor your recent transactions and activities here
          </p>
        </Card>

        <Card title="Alerts">
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              <Package className="w-4 h-4 shrink-0" />
              {inventoryReport?.data?.lowStockCount || 0} items are low on stock
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded text-sm text-purple-800">
              <Wallet className="w-4 h-4 shrink-0" />
              Check pending invoices for outstanding payments
            </div>
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
