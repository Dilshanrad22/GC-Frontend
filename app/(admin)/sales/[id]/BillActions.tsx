'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Printer, Download, X, Undo2, Ban } from 'lucide-react';
import { voidSale, returnSaleItem } from '@/actions/sales';

interface BillActionsProps {
  saleId: string;
  bill: {
    receiptNumber: string;
    timestamp: string;
    cashier: string;
    customer?: string;
    customerPhone?: string;
    saleStatus?: string;
    items: {
      productId: string;
      productName: string;
      sku: string;
      quantity: number;
      unitPrice: number;
      discount: number;
      total: number;
    }[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: string;
    amountPaid: number;
    balance: number;
    billStatus: string;
  };
}

function formatMoney(value: number) {
  return `Rs.${Number(value).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BillActions({ bill, saleId }: BillActionsProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [panel, setPanel] = useState<'none' | 'void' | 'return'>('none');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const [voidReason, setVoidReason] = useState('');
  const [returnForm, setReturnForm] = useState({ productId: '', quantity: '', reason: '' });

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('user='));
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie.substring(5)));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRole(user?.role?.name ?? null);
      } catch (e) {
        console.error('Failed to parse user cookie');
      }
    }
  }, []);

  const isVoided = bill.saleStatus === 'voided';
  const canVoid = role === 'admin' && !isVoided;
  const canReturn = (role === 'admin' || role === 'staff') && !isVoided;

  async function handleDownload() {
    setDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF();
      const timestamp = new Date(bill.timestamp);

      doc.setFontSize(16);
      doc.text('G.C. Print Shop', 14, 18);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Invoice #${bill.receiptNumber}`, 14, 25);
      doc.text(
        `${timestamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at ${timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
        14,
        30
      );

      doc.setTextColor(0);
      doc.text(`Customer: ${bill.customer || 'Walk-in Customer'}`, 14, 40);
      if (bill.customerPhone) doc.text(`Phone: ${bill.customerPhone}`, 14, 45);
      doc.text(`Cashier: ${bill.cashier}`, 120, 40);

      autoTable(doc, {
        startY: 52,
        head: [['Product', 'Code', 'Qty', 'Unit Price', 'Discount', 'Total']],
        body: bill.items.map((item) => [
          item.productName,
          item.sku,
          String(item.quantity),
          formatMoney(item.unitPrice),
          item.discount ? formatMoney(item.discount) : '-',
          formatMoney(item.total),
        ]),
        headStyles: { fillColor: [147, 51, 234] },
        styles: { fontSize: 9 },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 8;
      const totalsLines = [
        ['Subtotal', formatMoney(bill.subtotal)],
        ...(bill.discount > 0 ? [['Total Discount', `-${formatMoney(bill.discount)}`]] : []),
        ...(bill.tax > 0 ? [['Tax', formatMoney(bill.tax)]] : []),
        ['Grand Total', formatMoney(bill.total)],
        ['Payment Method', bill.paymentMethod?.replace('_', ' ')],
        ['Amount Paid', formatMoney(bill.amountPaid)],
        [bill.balance > 0 ? 'Balance Due' : 'Change', formatMoney(Math.abs(bill.balance))],
      ];

      doc.setFontSize(10);
      let y = finalY;
      for (const [label, value] of totalsLines) {
        doc.text(String(label), 140, y);
        doc.text(String(value), 196, y, { align: 'right' });
        y += 6;
      }

      doc.save(`Invoice-${bill.receiptNumber}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  function submitVoid(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!voidReason.trim()) {
      setError('A reason is required to void this sale');
      return;
    }
    startTransition(async () => {
      const result = await voidSale(saleId, voidReason);
      if (!result?.success) {
        setError(result?.error?.message || 'Could not void this sale');
        return;
      }
      setPanel('none');
      router.refresh();
    });
  }

  function submitReturn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const quantity = Number(returnForm.quantity);
    const item = bill.items.find((i) => i.productId === returnForm.productId);
    if (!returnForm.productId) {
      setError('Choose which item is being returned');
      return;
    }
    if (!quantity || quantity <= 0 || (item && quantity > item.quantity)) {
      setError('Enter a valid quantity (no more than what was sold)');
      return;
    }
    if (!returnForm.reason.trim()) {
      setError('A reason is required');
      return;
    }
    startTransition(async () => {
      const result = await returnSaleItem(saleId, returnForm.productId, quantity, returnForm.reason);
      if (!result?.success) {
        setError(result?.error?.message || 'Could not process the return');
        return;
      }
      setPanel('none');
      setReturnForm({ productId: '', quantity: '', reason: '' });
      router.refresh();
    });
  }

  return (
    <div className="space-y-3 print:hidden">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => window.print()}>
          <Printer className="w-4 h-4" /> Print Bill
        </Button>
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer className="w-4 h-4" /> Reprint Bill
        </Button>
        <Button variant="secondary" onClick={handleDownload} disabled={downloading}>
          <Download className="w-4 h-4" /> {downloading ? 'Preparing...' : 'Download PDF'}
        </Button>
        {canReturn && (
          <Button
            variant="secondary"
            onClick={() => setPanel(panel === 'return' ? 'none' : 'return')}
          >
            <Undo2 className="w-4 h-4" /> Return Item
          </Button>
        )}
        {canVoid && (
          <Button variant="danger" onClick={() => setPanel(panel === 'void' ? 'none' : 'void')}>
            <Ban className="w-4 h-4" /> Void Sale
          </Button>
        )}
        <Button variant="ghost" onClick={() => router.back()}>
          <X className="w-4 h-4" /> Close
        </Button>
      </div>

      {isVoided && (
        <p className="text-sm text-red-600 font-medium">This sale has been voided.</p>
      )}

      {panel === 'void' && (
        <form onSubmit={submitVoid} className="max-w-md space-y-3 bg-red-50 border border-red-200 rounded-lg p-4">
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Input
            label="Reason for voiding this sale"
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" variant="danger" disabled={isPending}>
              {isPending ? 'Voiding...' : 'Confirm Void'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setPanel('none')}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {panel === 'return' && (
        <form onSubmit={submitReturn} className="max-w-md space-y-3 bg-slate-50 border border-slate-200 rounded-lg p-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Item</label>
            <select
              value={returnForm.productId}
              onChange={(e) => setReturnForm({ ...returnForm, productId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            >
              <option value="">Select item...</option>
              {bill.items.map((item) => (
                <option key={item.productId} value={item.productId}>
                  {item.productName} (sold: {item.quantity})
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Quantity to return"
            type="number"
            min={1}
            value={returnForm.quantity}
            onChange={(e) => setReturnForm({ ...returnForm, quantity: e.target.value })}
            required
          />
          <Input
            label="Reason"
            value={returnForm.reason}
            onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Processing...' : 'Confirm Return'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setPanel('none')}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
