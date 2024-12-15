'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AddFriendModal } from '@/components/modals/AddFriendModal';
import { usePathname } from 'next/navigation';
import type { FriendStatus } from '@/types';
import { cn } from '@/lib/utils';

interface TopBarProps {
  currentView: FriendStatus;
  onViewChange: (view: FriendStatus) => void;
}

export function TopBar({ currentView, onViewChange }: TopBarProps) {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/me';

  if (!isHomePage) {
    return (
      <div className="h-16 border-b border-[#262626] bg-[#1f1f1f] flex items-center px-6">
        {/* other page content will be later */}
      </div>
    );
  }

  const buttonClass = (view: FriendStatus) => cn(
    "h-8 px-3 text-sm transition-colors font-medium",
    "hover:bg-white/10",
    currentView === view 
      ? "bg-white/10 text-white" 
      : "text-gray-300 hover:text-white"
  );

  return (
    <>
      <div className="h-16 border-b border-[#262626] bg-[#1f1f1f] flex items-center px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            <span className="font-semibold">Friends</span>
          </div>
          <Separator orientation="vertical" className="h-6 bg-[#262626]" />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => onViewChange('ONLINE')}
              className={buttonClass('ONLINE')}
            >
              Online
            </Button>
            <Button
              variant="ghost"
              onClick={() => onViewChange('ALL')}
              className={buttonClass('ALL')}
            >
              All
            </Button>
            <Button
              variant="ghost"
              onClick={() => onViewChange('PENDING')}
              className={buttonClass('PENDING')}
            >
              Pending
            </Button>
            <Button
              variant="ghost"
              onClick={() => onViewChange('BLOCKED')}
              className={buttonClass('BLOCKED')}
            >
              Blocked
            </Button>
            <Button
              className="h-8 px-3 text-sm bg-green-600 hover:bg-green-700 text-white ml-2 font-medium"
              onClick={() => setShowAddFriend(true)}
            >
              Add Friend
            </Button>
          </div>
        </div>
      </div>

      <AddFriendModal 
        isOpen={showAddFriend}
        onClose={() => setShowAddFriend(false)}
      />
    </>
  );
}