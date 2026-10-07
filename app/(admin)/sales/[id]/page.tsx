import { Card } from '@/components/ui/card';
import { getReceipt } from '@/actions/sales';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BillActions } from './BillActions';

function formatMoney(value: number) {
  return `Rs.${Number(value).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const billStatusStyles: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  partial: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-red-100 text-red-700',
};

export default async function BillDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getReceipt(id);

  if (!response?.success || !response?.data) {
    notFound();
  }

  const bill = response.data;
  const timestamp = new Date(bill.timestamp);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Bill Details</h1>
        <BillActions bill={bill} />
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Invoice #{bill.receiptNumber}</h2>
            <p className="text-sm text-slate-500">
              {timestamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              {' at '}
              {timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <span
            className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
              billStatusStyles[bill.billStatus] || 'bg-slate-100 text-slate-600'
            }`}
          >
            {bill.billStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-6 pb-6 border-b border-slate-100">
          <div>
            <p className="text-slate-400">Customer</p>
            {bill.customerId ? (
              <Link
                href={`/customers/${bill.customerId}`}
                className="text-purple-600 font-medium hover:underline"
              >
                {bill.customer || 'View Customer'}
              </Link>
            ) : (
              <p className="text-slate-900 font-medium">{bill.customer || 'Walk-in Customer'}</p>
            )}
          </div>
          <div>
            <p className="text-slate-400">Phone</p>
            <p className="text-slate-900 font-medium">{bill.customerPhone || '-'}</p>
          </div>
          <div>
            <p className="text-slate-400">Cashier</p>
            <p className="text-slate-900 font-medium">{bill.cashier}</p>
          </div>
        </div>

        {/* Items */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Product</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Code</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Qty</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Unit Price</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Discount</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bill.items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="px-3 py-2.5 text-slate-900">{item.productName}</td>
                  <td className="px-3 py-2.5 text-slate-500">{item.sku}</td>
                  <td className="px-3 py-2.5 text-right text-slate-700">{item.quantity}</td>
                  <td className="px-3 py-2.5 text-right text-slate-700">{formatMoney(item.unitPrice)}</td>
                  <td className="px-3 py-2.5 text-right text-slate-700">
                    {item.discount ? formatMoney(item.discount) : '-'}
                  </td>
                  <td className="px-3 py-2.5 text-right text-slate-900 font-medium">
                    {formatMoney(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="max-w-xs ml-auto space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatMoney(bill.subtotal)}</span>
          </div>
          {bill.discount > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Total Discount</span>
              <span>-{formatMoney(bill.discount)}</span>
            </div>
          )}
          {bill.tax > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span>{formatMoney(bill.tax)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>Grand Total</span>
            <span>{formatMoney(bill.total)}</span>
          </div>
          <div className="flex justify-between text-slate-600 pt-2">
            <span>Payment Method</span>
            <span className="capitalize">{bill.paymentMethod?.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Amount Paid</span>
            <span>{formatMoney(bill.amountPaid)}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-900">
            <span>{bill.balance > 0 ? 'Balance Due' : 'Change'}</span>
            <span>{formatMoney(Math.abs(bill.balance))}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
