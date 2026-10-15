'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  Receipt,
  ShoppingBag,
  BarChart3,
  Settings as SettingsIcon,
  type LucideIcon,
} from 'lucide-react';

const menuItems: { name: string; href: string; icon: LucideIcon; adminOnly?: boolean }[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users, adminOnly: true },
  { name: 'Products', href: '/products', icon: Package, adminOnly: true },
  { name: 'Inventory', href: '/inventory', icon: Boxes },
  { name: 'Web Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Billing', href: '/sales', icon: Receipt },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

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

  // Before the cookie is read (first render), show every item rather than
  // guessing — this only flashes admin-only items for a staff user for a
  // moment; the backend still enforces the real restriction either way.
  const visibleItems = menuItems.filter((item) => !item.adminOnly || role === null || role === 'admin');

  return (
    <aside className="print:hidden bg-white border-r border-slate-200 w-64 min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="G.C. Print Shop" className="w-9 h-9 object-contain shrink-0" />
          <div>
            <h1 className="text-sm font-semibold text-slate-900 leading-tight">
              G.C. Print Shop
            </h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={2} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
