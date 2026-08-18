'use client';

import { useState, useEffect } from 'react';
import { logoutAction } from '@/actions/auth';

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
        setUser(JSON.parse(decodeURIComponent(userCookie.substring(5))));
      } catch (e) {
        console.error('Failed to parse user cookie');
      }
    }
  }, []);

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Admin Panel</h2>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-slate-100"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-slate-500">{user?.role?.name || 'User'}</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setShowMenu(false);
                  logoutAction();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
