'use client';

import { useState, useEffect } from 'react';
import { logoutAction } from '@/actions/auth';
import { ChevronDown, LogOut } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  role?: {
    name: string;
  };
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('user='));
    if (userCookie) {
      try {
        // Cookie is only readable client-side; state is set post-mount by
        // design so the server-rendered and pre-hydration markup match.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(decodeURIComponent(userCookie.substring(5))));
      } catch (e) {
        console.error('Failed to parse user cookie');
      }
    }
  }, []);

  return (
    <nav className="print:hidden bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-3.5 sticky top-0 z-30">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-slate-900">Admin Panel</h2>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 leading-tight">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-slate-400">{user?.role?.name || 'User'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-10">
              <button
                onClick={() => {
                  setShowMenu(false);
                  logoutAction();
                }}
                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
