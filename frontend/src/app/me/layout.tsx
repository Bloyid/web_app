'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { motion } from 'framer-motion';
import type { FriendStatus } from '@/types';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [currentView, setCurrentView] = useState<FriendStatus>('ALL');

  const handleViewChange = (view: FriendStatus) => {
    setCurrentView(view);
  };

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        className="flex h-screen"
      >
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar 
            currentView={currentView} 
            onViewChange={handleViewChange}
          />
          <main className="flex-1 bg-[#2d2d2d]">
            {children}
          </main>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}