import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { getInventory, getLowStockItems } from '@/actions/inventory';
import Link from 'next/link';

async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; lowStock?: string }>;
}) {
  const query = await searchParams;
  const page = parseInt(query.page || '1');
  const lowStockOnly = query.lowStock === 'true';

  const response = lowStockOnly
    ? await getLowStockItems()
    : await getInventory(page, 20);

  const items = lowStockOnly
    ? response?.data?.data || []
    : response?.data?.data || [];
  const pagination = lowStockOnly ? null : response?.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-600">Stock levels across all products</p>
        </div>
        <Link href={lowStockOnly ? '/inventory' : '/inventory?lowStock=true'}>
          <Button variant={lowStockOnly ? 'secondary' : 'danger'}>
            {lowStockOnly ? 'Show All Stock' : 'Show Low Stock Only'}
          </Button>
        </Link>
      </div>

      <Card>
        {items.length > 0 ? (
          <>
            <Table
              headers={['SKU', 'Product', 'Current Stock', 'Minimum Stock', 'Status', '']}
              rows={items.map((item: any) => [
                item.product?.sku || '-',
                item.product?.name || '-',
                item.currentStock,
                item.minimumStock,
                item.isLowStock ? (
                  <span className="text-red-600 font-medium">Low Stock</span>
                ) : (
                  <span className="text-green-600 font-medium">OK</span>
                ),
                <Link
                  key={item.id}
                  href={`/inventory/${item.productId}`}
                  className="text-purple-600 hover:underline"
                >
                  View / Adjust
                </Link>,
              ])}
            />

            {pagination && (
              <div className="mt-4 flex justify-center gap-2">
                {pagination.page > 1 && (
                  <Link href={`/inventory?page=${page - 1}`}>
                    <Button variant="secondary" size="sm">
                      Previous
                    </Button>
                  </Link>
                )}
                <span className="px-4 py-2 text-sm text-slate-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                {pagination.page < pagination.totalPages && (
                  <Link href={`/inventory?page=${page + 1}`}>
                    <Button variant="secondary" size="sm">
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-slate-600 py-8">
            {lowStockOnly ? 'No products are low on stock' : 'No inventory records found'}
          </p>
        )}
      </Card>
    </div>
  );
}

export default InventoryPage;
