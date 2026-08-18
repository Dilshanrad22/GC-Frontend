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
    <aside className="bg-white border-r border-slate-200 w-64 min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            GC
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 leading-tight">
              GC Admin
            </h1>
            <p className="text-xs text-slate-400">Printing & Retail</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
