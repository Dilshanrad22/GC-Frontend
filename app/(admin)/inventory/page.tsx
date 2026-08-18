import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getInventory, getLowStockItems } from '@/actions/inventory';
import Link from 'next/link';

async function InventoryPage({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const view = searchParams.view || 'all';

  let response;
  if (view === 'low-stock') {
    response = await getLowStockItems();
  } else {
    response = await getInventory();
  }

  const items = response?.data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Inventory</h1>
        <p className="text-slate-600">Track and manage your stock levels</p>
      </div>

      <div className="flex gap-2">
        <Link href="/inventory?view=all">
          <Button variant={view === 'all' ? 'primary' : 'secondary'}>
            All Stock
          </Button>
        </Link>
        <Link href="/inventory?view=low-stock">
          <Button variant={view === 'low-stock' ? 'primary' : 'secondary'}>
            Low Stock ⚠️
          </Button>
        </Link>
      </div>

      <Card>
        {items.length > 0 ? (
          <>
            <Table
              headers={['Product', 'SKU', 'Current Stock', 'Min. Stock', 'Status']}
              rows={items.map((item: any) => [
                <Link
                  key={item.id}
                  href={`/inventory/${item.productId}`}
                  className="text-blue-600 hover:underline"
                >
                  {item.product?.name}
                </Link>,
                item.product?.sku,
                item.currentStock,
                item.product?.minimumStock || 0,
                item.currentStock <= (item.product?.minimumStock || 0) ? (
                  <span className="text-red-600 font-medium">⚠️ Low</span>
                ) : item.currentStock === 0 ? (
                  <span className="text-orange-600 font-medium">⚠️ Out</span>
                ) : (
                  <span className="text-green-600 font-medium">✓ In Stock</span>
                ),
              ])}
            />
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">No inventory items</p>
        )}
      </Card>
    </div>
  );
}

export default InventoryPage;
