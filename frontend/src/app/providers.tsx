'use client';

import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  return <div className="w-full min-h-screen">{children}</div>;
}