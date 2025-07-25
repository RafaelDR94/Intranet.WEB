// app/main-page/layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext/ThemeContext';
import { ToggleButton } from '../components/ToogleButton.tsx/ToogleButton';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 border-r flex flex-col">
        {/* Toggle de tema */}
        <div className="mb-6">
          <ToggleButton
            checked={theme === 'dark'}
            onChange={toggleTheme}
            label={theme === 'light' ? '🌙' : '☀️'}
          />
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/main-page/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">
            Dashboard
          </Link>
          {/* agrega aquí más enlaces si lo necesitas */}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-grow bg-gray-50 p-6">{children}</main>
    </div>
  );
}
