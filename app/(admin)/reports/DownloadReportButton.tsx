'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

function formatMoney(value: number) {
  return `Rs.${Number(value).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface DownloadReportButtonProps {
  period: 'daily' | 'weekly' | 'monthly';
  trendPoints: { label: string; total: number; transactions: number }[];
  topProducts: { productName: string; sku: string; quantity: number; revenue: number }[];
  lowStockItems: { productName: string; sku: string; currentStock: number; minimumStock: number }[];
  topCustomers: { name: string; totalTransactions: number; totalSpent: number; outstanding: number }[];
}

export function DownloadReportButton({
  period,
  trendPoints,
  topProducts,
  lowStockItems,
  topCustomers,
}: DownloadReportButtonProps) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF();
      const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      doc.setFontSize(16);
      doc.text('G.C. Print Shop', 14, 18);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Business Report (${period}) — generated ${today}`, 14, 25);
      doc.setTextColor(0);

      const totalSales = trendPoints.reduce((sum, p) => sum + p.total, 0);
      const totalTransactions = trendPoints.reduce((sum, p) => sum + p.transactions, 0);

      let y = 36;
      doc.setFontSize(12);
      doc.text('Summary', 14, y);
      y += 6;
      doc.setFontSize(10);
      doc.text(`Total Sales: ${formatMoney(totalSales)}`, 14, y);
      doc.text(`Transactions: ${totalTransactions}`, 100, y);
      y += 10;

      autoTable(doc, {
        startY: y,
        head: [['Period', 'Sales', 'Transactions']],
        body: trendPoints.map((p) => [p.label, formatMoney(p.total), String(p.transactions)]),
        headStyles: { fillColor: [147, 51, 234] },
        styles: { fontSize: 9 },
      });

      let nextY = (doc as any).lastAutoTable.finalY + 10;

      if (topProducts.length > 0) {
        doc.setFontSize(12);
        doc.text('Top Products', 14, nextY);
        autoTable(doc, {
          startY: nextY + 4,
          head: [['Product', 'Code', 'Qty Sold', 'Revenue']],
          body: topProducts.map((p) => [p.productName, p.sku, String(p.quantity), formatMoney(p.revenue)]),
          headStyles: { fillColor: [147, 51, 234] },
          styles: { fontSize: 9 },
        });
        nextY = (doc as any).lastAutoTable.finalY + 10;
      }

      if (lowStockItems.length > 0) {
        doc.setFontSize(12);
        doc.text('Low Stock Alerts', 14, nextY);
        autoTable(doc, {
          startY: nextY + 4,
          head: [['Product', 'Code', 'In Stock', 'Minimum']],
          body: lowStockItems.map((i) => [i.productName, i.sku, String(i.currentStock), String(i.minimumStock)]),
          headStyles: { fillColor: [217, 119, 6] },
          styles: { fontSize: 9 },
        });
        nextY = (doc as any).lastAutoTable.finalY + 10;
      }

      if (topCustomers.length > 0) {
        doc.setFontSize(12);
        doc.text('Top Customers', 14, nextY);
        autoTable(doc, {
          startY: nextY + 4,
          head: [['Customer', 'Orders', 'Total Spent', 'Outstanding']],
          body: topCustomers.map((c) => [
            c.name,
            String(c.totalTransactions),
            formatMoney(c.totalSpent),
            formatMoney(c.outstanding),
          ]),
          headStyles: { fillColor: [147, 51, 234] },
          styles: { fontSize: 9 },
        });
      }

      doc.save(`GC-Report-${period}-${new Date().toISOString().split('T')[0]}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Button variant="secondary" onClick={handleDownload} disabled={downloading}>
      <Download className="w-4 h-4" /> {downloading ? 'Preparing...' : 'Download Full Report'}
    </Button>
  );
}
