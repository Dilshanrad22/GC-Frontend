import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'GC Admin Panel',
  description: 'Printing & Retail Business Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
