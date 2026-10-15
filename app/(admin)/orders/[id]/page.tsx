import { Card } from '@/components/ui/card';
import { getOrder } from '@/actions/orders';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { OrderStatusActions } from './OrderStatusActions';

function formatMoney(value: string | number) {
  return `Rs.${Number(value).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getOrder(id);

  if (!response?.success || !response?.data) {
    notFound();
  }

  const order = response.data;
  const placed = new Date(order.createdAt);

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/orders" className="inline-flex items-center gap-1.5 text-purple-600 hover:underline">
        <ArrowLeft className="w-4 h-4" /> All orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order {order.orderNumber}</h1>
          <p className="text-sm text-slate-500">
            Placed{' '}
            {placed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at{' '}
            {placed.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span
          className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
            statusStyles[order.status] || 'bg-slate-100 text-slate-600'
          }`}
        >
          {order.status}
        </span>
      </div>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Customer</p>
            <p className="font-medium text-slate-900">{order.customer.name}</p>
            <p className="text-slate-600">{order.customer.phone}</p>
            {order.customer.email && <p className="text-slate-600">{order.customer.email}</p>}
          </div>
          <div>
            <p className="text-slate-400">Fulfilment</p>
            <p className="font-medium text-slate-900">
              {order.fulfillment === 'delivery' ? 'Delivery' : 'Pickup from shop'}
            </p>
            {order.fulfillment === 'delivery' && (
              <p className="text-slate-600 whitespace-pre-line">{order.deliveryAddress}</p>
            )}
          </div>
          <div>
            <p className="text-slate-400">Notes</p>
            <p className="text-slate-700 whitespace-pre-line">{order.notes || '—'}</p>
          </div>
        </div>
      </Card>

      <Card title="Items">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Product', 'SKU', 'Qty', 'Unit price', 'Line total'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-slate-900">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.sku}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{formatMoney(item.unitPrice)}</td>
                  <td className="px-4 py-3 font-medium">{formatMoney(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end text-lg font-bold text-slate-900">
          Total: {formatMoney(order.total)}
        </div>
      </Card>

      <Card title="Update status" subtitle="Confirming takes the items out of stock. Cancelling a confirmed order puts them back.">
        <OrderStatusActions orderId={order.id} status={order.status} />
      </Card>
    </div>
  );
}
