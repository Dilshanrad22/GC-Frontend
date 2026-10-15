import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { getInventoryItem, getStockMovements } from '@/actions/inventory';
import { isAdmin } from '@/lib/currentUser';
import { AdjustStockForm } from './AdjustStockForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const MOVEMENT_LABELS: Record<string, string> = {
  opening_stock: 'Opening Stock',
  damaged: 'Damaged',
  customer_return: 'Customer Return',
  adjustment_increase: 'Manual Increase',
  adjustment_decrease: 'Manual Decrease',
};

async function InventoryDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const [itemResponse, movementsResponse, admin] = await Promise.all([
    getInventoryItem(productId),
    getStockMovements(productId, 1, 50),
    isAdmin(),
  ]);

  if (!itemResponse?.success || !itemResponse.data) {
    notFound();
  }

  const item = itemResponse.data;
  const movements = movementsResponse?.data?.movements || [];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/inventory" className="text-sm text-purple-600 hover:underline">
          ← Back to Inventory
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">{item.product.name}</h1>
        <p className="text-slate-600">SKU: {item.product.sku}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Current Stock">
          <p className="text-3xl font-bold text-slate-900">{item.currentStock}</p>
          <p className="text-sm text-slate-500 mt-1">Minimum: {item.minimumStock}</p>
          {item.isLowStock && (
            <p className="text-sm text-red-600 font-medium mt-2">Low stock</p>
          )}
        </Card>

        {admin && (
          <Card title="Adjust Stock" className="lg:col-span-2">
            <AdjustStockForm productId={productId} />
          </Card>
        )}
      </div>

      <Card title="Movement History">
        {movements.length > 0 ? (
          <Table
            headers={['Date', 'Type', 'Quantity', 'Before', 'After', 'Reason', 'By']}
            rows={movements.map((m: any) => [
              new Date(m.createdAt).toLocaleString(),
              MOVEMENT_LABELS[m.movementType] || m.movementType,
              m.quantity,
              m.quantityBefore ?? '-',
              m.quantityAfter ?? '-',
              m.reason || '-',
              m.createdBy?.fullName || '-',
            ])}
          />
        ) : (
          <p className="text-center text-slate-600 py-8">No stock movements recorded yet</p>
        )}
      </Card>
    </div>
  );
}

export default InventoryDetailPage;
