'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Customers', href: '/customers', icon: '👥' },
  { name: 'Products', href: '/products', icon: '📦' },
  { name: 'Inventory', href: '/inventory', icon: '📦' },
  { name: 'Sales', href: '/sales', icon: '💰' },
  { name: 'Invoices', href: '/invoices', icon: '📄' },
  { name: 'Suppliers', href: '/suppliers', icon: '🏭' },
  { name: 'Printing Jobs', href: '/printing-jobs', icon: '🖨️' },
  { name: 'Expenses', href: '/expenses', icon: '💸' },
  { name: 'Reports', href: '/reports', icon: '📈' },
  { name: 'Audit Logs', href: '/audit-logs', icon: '📋' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">GC Admin</h1>
        <p className="text-xs text-slate-400">Printing & Retail</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
