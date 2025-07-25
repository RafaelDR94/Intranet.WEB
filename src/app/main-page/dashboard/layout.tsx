// src/app/main-page/dashboard/layout.tsx
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4">
      {/* Aquí podrías poner tu sub-navegación de Dashboard */}
      {children}
    </div>
  );
}