'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Printer, Download, X } from 'lucide-react';

interface BillActionsProps {
  bill: {
    receiptNumber: string;
    timestamp: string;
    cashier: string;
    customer?: string;
    customerPhone?: string;
    items: {
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

export function BillActions({ bill }: BillActionsProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

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

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <Button onClick={() => window.print()}>
        <Printer className="w-4 h-4" /> Print Bill
      </Button>
      <Button variant="secondary" onClick={() => window.print()}>
        <Printer className="w-4 h-4" /> Reprint Bill
      </Button>
      <Button variant="secondary" onClick={handleDownload} disabled={downloading}>
        <Download className="w-4 h-4" /> {downloading ? 'Preparing...' : 'Download PDF'}
      </Button>
      <Button variant="ghost" onClick={() => router.back()}>
        <X className="w-4 h-4" /> Close
      </Button>
    </div>
  );
}
