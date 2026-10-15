'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'gc-admin-theme';

export function ThemeToggle() {
  // Starts false on the server and on first client render (matching it) to
  // avoid a hydration mismatch; the real value is read from the <html>
  // class right after mount, which the layout's inline script already set.
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Reads state an external system (the DOM, set by the layout's
    // pre-hydration init script) already settled, post-mount by design so
    // the server-rendered and pre-hydration markup match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains('dark'));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme just
      // won't persist across reloads, which is harmless.
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={mounted ? isDark : undefined}
      aria-label="Toggle dark mode"
      onClick={toggle}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
        isDark ? 'bg-purple-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform ${
          isDark ? 'translate-x-6' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-purple-600" />
        ) : (
          <Sun className="w-3 h-3 text-slate-400" />
        )}
      </span>
    </button>
  );
}
