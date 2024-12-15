// src/components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Home, Plus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserPanel } from './UserPanel';
import { useAuth } from '@/context/auth';
import type { User } from '@/types';

interface Server {
  id: string;
  name: string;
  imageUrl?: string;
}

export function Sidebar() {
  const [servers, setServers] = useState<Server[]>([]);
  const [activeId, setActiveId] = useState<string>('home');
  const { user } = useAuth();
  const router = useRouter();

  const handleServerClick = (id: string) => {
    setActiveId(id);
    router.push(id === 'home' ? '/me' : `/servers/${id}`);
  };

  return (
    <div className="flex h-screen">
      {/* Server List */}
      <div className="w-[72px] bg-[#1a1a1a] flex flex-col items-center py-3 space-y-2 border-r border-[#262626]">
        <button
          onClick={() => handleServerClick('home')}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            "hover:rounded-2xl hover:bg-white/10",
            activeId === 'home' ? "bg-white/10 rounded-2xl" : "bg-[#2d2d2d]"
          )}
        >
          <Home className="w-6 h-6" />
        </button>

        <Separator className="w-8 bg-[#262626]" />

        <ScrollArea className="w-full">
          <div className="flex flex-col items-center space-y-2">
            {servers.map((server) => (
              <button
                key={server.id}
                onClick={() => handleServerClick(server.id)}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                  "hover:rounded-2xl hover:bg-white/10",
                  activeId === server.id ? "bg-white/10 rounded-2xl" : "bg-[#2d2d2d]"
                )}
              >
                {server.imageUrl ? (
                  <img
                    src={server.imageUrl}
                    alt={server.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {server.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </button>
            ))}
            
            <button
              onClick={() => {/* add server modal */}}
              className="w-12 h-12 rounded-full bg-[#2d2d2d] flex items-center justify-center hover:rounded-2xl hover:bg-white/10 transition-all"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </ScrollArea>
      </div>

      {/* channel/dm list with user panel */}
      <div className="w-60 bg-[#1f1f1f] flex flex-col border-r border-[#262626]">
        {/* header */}
        <div className="h-14 flex items-center px-4 font-semibold shadow-sm border-b border-[#262626]">
          {activeId === 'home' ? 'Direct Messages' : 'Server Name'}
        </div>
            
        {/* content area */}
        <div className="flex-1 flex flex-col">
          {activeId === 'home' ? (
            <>
              <Button
                variant="ghost"
                className="flex items-center w-full px-3 h-12 justify-start hover:bg-white hover:text-black text-gray-200 text-base transition-colors"
                onClick={() => router.push('/chat/friends')}
              >
                <Users className="w-5 h-5 mr-2" />
                Friends
              </Button>

              <ScrollArea className="flex-1">
                <div className="px-2 py-3 space-y-1">
                  {/* DM list */}
                </div>
              </ScrollArea>
            </>
          ) : (
            <ScrollArea className="flex-1">
              <div className="px-2 py-3">
                {/* server channels */}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* user panel*/}
        <UserPanel 
          user={{ 
            username: user?.username ?? 'Loading...',
            avatar: user?.avatar
          }} 
        />
      </div>
    </div>
  );
}