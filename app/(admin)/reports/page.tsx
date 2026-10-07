import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getSalesReport,
  getRevenueReport,
  getProductSalesReport,
  getInventoryReport,
  getCustomerReport,
} from '@/actions/reports';
import Link from 'next/link';

async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const query = await searchParams;
  const view = query.view || 'sales';

  let data;
  switch (view) {
    case 'revenue':
      data = await getRevenueReport();
      break;
    case 'products':
      data = await getProductSalesReport();
      break;
    case 'inventory':
      data = await getInventoryReport();
      break;
    case 'customers':
      data = await getCustomerReport();
      break;
    default:
      data = await getSalesReport();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600">Business analytics and insights</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <Link href="/reports?view=sales">
          <Button
            variant={view === 'sales' ? 'primary' : 'secondary'}
            className="w-full"
            size="sm"
          >
            Sales
          </Button>
        </Link>
        <Link href="/reports?view=revenue">
          <Button
            variant={view === 'revenue' ? 'primary' : 'secondary'}
            className="w-full"
            size="sm"
          >
            Revenue
          </Button>
        </Link>
        <Link href="/reports?view=products">
          <Button
            variant={view === 'products' ? 'primary' : 'secondary'}
            className="w-full"
            size="sm"
          >
            Products
          </Button>
        </Link>
        <Link href="/reports?view=inventory">
          <Button
            variant={view === 'inventory' ? 'primary' : 'secondary'}
            className="w-full"
            size="sm"
          >
            Inventory
          </Button>
        </Link>
        <Link href="/reports?view=customers">
          <Button
            variant={view === 'customers' ? 'primary' : 'secondary'}
            className="w-full"
            size="sm"
          >
            Customers
          </Button>
        </Link>
      </div>

      <Card title={`${view.charAt(0).toUpperCase() + view.slice(1)} Report`}>
        <div className="space-y-4">
          {data?.data ? (
            <pre className="bg-slate-50 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(data.data, null, 2)}
            </pre>
          ) : (
            <p className="text-slate-600">No data available for this report</p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default ReportsPage;
