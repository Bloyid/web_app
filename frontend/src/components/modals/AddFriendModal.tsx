'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus2 } from 'lucide-react';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendRequest = async () => {
    if (!username.trim()) return;

    setLoading(true);
    try {
      console.log('Searching for user:', username);
      const searchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/search?query=${username}`, {
        credentials: 'include'
      });
      
      const users = await searchResponse.json();
      console.log('Search results:', users);

      if (!users || users.length === 0) {
        toast({
          variant: "destructive",
          title: "User not found",
          description: "No user found with that username."
        });
        return;
      }

      const user = users[0];
      console.log('Selected user:', user);

      const requestBody = { receiverId: user.id };
      console.log('Sending request with body:', requestBody);

      const requestResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      if (!requestResponse.ok) {
        const errorData = await requestResponse.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.message);
      }

      const responseData = await requestResponse.json();
      console.log('Success response:', responseData);

      toast({
        title: "Friend request sent!",
        description: `Friend request sent to ${user.name}`,
      });

      setUsername('');
      onClose();
    } catch (error: any) {
      console.error('Request failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send friend request"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2d2d2d] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <UserPlus2 className="w-5 h-5" />
            Add Friend
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">
              You can add friends with their username
            </Label>
            <Input
              id="username"
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#1a1a1a] border-gray-700 text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleSendRequest();
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="hover:bg-white/10 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendRequest}
              disabled={loading || !username.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <UserPlus2 className="w-4 h-4 mr-2" />
              )}
              Send Friend Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}