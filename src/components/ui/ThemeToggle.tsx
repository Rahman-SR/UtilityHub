'use client';

import React, { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from './Button';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isMounted) {
    return (
      <Button variant="ghost" size="sm" aria-label="Toggle theme" className="w-9 h-9 p-0">
        <span className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 p-0 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 scale-100" />
      )}
    </Button>
  );
}
