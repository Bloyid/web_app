'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, Mic, Headphones } from 'lucide-react';
import type { User as UserTypes } from '@/types';

interface UserPanelProps {
    user: Pick<UserTypes, 'username' | 'avatar'>;
  }

export function UserPanel({ user }: UserPanelProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  return (
    <div className="h-14 bg-[#1a1a1a] border-t border-[#262626] p-2 flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center w-full p-1 rounded hover:bg-white/5">
          <div className="flex items-center flex-1 gap-2">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#2d2d2d] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="flex-1 text-sm text-left">
              <div className="font-medium text-white truncate">{user.username}</div>
              <div className="text-xs text-gray-400">Online</div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[#1f1f1f] border-[#262626] text-gray-200">
          <DropdownMenuItem className="hover:bg-white hover:text-black focus:bg-white focus:text-black cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-white hover:text-black focus:bg-white focus:text-black cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#262626]" />
          <DropdownMenuItem className="text-red-400 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2 rounded hover:bg-white/5 ${isMuted ? 'text-red-400' : 'text-gray-200'}`}
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsDeafened(!isDeafened)}
          className={`p-2 rounded hover:bg-white/5 ${isDeafened ? 'text-red-400' : 'text-gray-200'}`}
        >
          <Headphones className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}