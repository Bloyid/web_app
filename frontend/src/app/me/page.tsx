'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { PendingRequestCard } from '@/components/friends/PendingRequestCard';
import { Button } from '@/components/ui/button';
import type { Friend, FriendStatus } from '@/types';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
}

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING';
  type: 'INCOMING' | 'OUTGOING';
  sender: User;
  receiver: User;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<FriendStatus>('ALL');

  useEffect(() => {
    fetchFriends();
    if (currentView === 'PENDING') {
      fetchPendingRequests();
    }
  }, [currentView]);

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends`, {
        credentials: 'include'
      });
      const data = await response.json();
      setFriends(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests`, {
        credentials: 'include'
      });
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/request/${requestId}/accept`, {
        method: 'POST',
        credentials: 'include'
      });
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      await fetchFriends();
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/request/${requestId}/decline`, {
        method: 'POST',
        credentials: 'include'
      });
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Failed to decline friend request:', error);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/request/${requestId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Failed to cancel friend request:', error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      );
    }

    if (currentView === 'PENDING') {
      return (
        <div className="space-y-3 pt-4">
          {pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-gray-400">
              <div className="text-xl font-semibold mb-2">No pending friend requests</div>
              <div className="text-sm text-gray-500">
                When someone adds you as a friend, you'll see it here!
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl mx-auto">
              {pendingRequests.map((request) => (
                <PendingRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAcceptRequest}
                  onDecline={handleDeclineRequest}
                  onCancel={handleCancelRequest}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    const filteredFriends = friends.filter(friend => {
      switch (currentView) {
        case 'ONLINE':
          return friend.status === 'online';
        case 'BLOCKED':
          return friend.status === 'blocked';
        case 'ALL':
          return friend.status !== 'blocked';
        default:
          return true;
      }
    });

    if (filteredFriends.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-gray-400">
          <div className="text-xl font-semibold mb-2">No friends found</div>
          <div className="text-sm text-gray-500">Try adding some friends to get started!</div>
        </div>
      );
    }

    return (
      <div className="space-y-2 max-w-3xl mx-auto px-4">
        {filteredFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center p-3 rounded-md hover:bg-white/5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#2d2d2d] mr-3">
              {friend.avatar && (
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-full h-full rounded-full"
                />
              )}
            </div>
            <div>
              <div className="font-medium text-white">{friend.name}</div>
              <div className="text-sm text-gray-400">{friend.status || 'Offline'}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ScrollArea className="flex-1">
      {renderContent()}
    </ScrollArea>
  );
}