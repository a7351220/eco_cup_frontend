'use client';

import React, { PropsWithChildren, useState } from 'react';
import Sidebar from '@/layout/sidebar';

export default function Layout({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
