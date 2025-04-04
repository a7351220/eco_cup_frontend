'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitch from '@/components/features/ThemeSwitch';

interface SidebarProps {
  isOpen: boolean;
  toggleOpen: () => void;
}

export default function Sidebar({ isOpen, toggleOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`z-50 mt-24 min-w-full h-sidebar transition-transform p-4 fixed overflow-y-auto 
          ${isOpen ? '-translate-x-0 sm:-translate-x-full shadow-xl' : '-translate-x-full'} 
          duration-300 bg-neutral-50 dark:bg-black`}
    >
      <div className="relative h-full p-4 rounded-xl flex flex-col justify-between overflow-y-auto">
        {/* Navigation removed as requested */}
        
        <ThemeSwitch className="mx-auto" />
      </div>
    </aside>
  );
}
