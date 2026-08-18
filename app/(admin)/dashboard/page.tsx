import { Card } from '@/components/ui/card';
import { getSalesReport, getRevenueReport, getInventoryReport } from '@/actions/reports';

async function DashboardPage() {
  const salesReport = await getSalesReport();
  const revenueReport = await getRevenueReport();
  const inventoryReport = await getInventoryReport();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome to GC Business Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
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
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              📦 {inventoryReport?.data?.lowStockCount || 0} items are low on stock
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              💰 Check pending invoices for outstanding payments
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
