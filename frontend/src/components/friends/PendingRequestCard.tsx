import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { FriendRequest } from "@/types";

interface PendingRequestCardProps {
  request: FriendRequest;
  onAccept?: (id: string) => Promise<void>;
  onDecline?: (id: string) => Promise<void>;
  onCancel?: (id: string) => Promise<void>;
}

export function PendingRequestCard({
  request,
  onAccept,
  onDecline,
  onCancel
}: PendingRequestCardProps) {
  const isIncoming = request.type === 'INCOMING';
  const user = isIncoming ? request.sender : request.receiver;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="flex items-center justify-between p-4 rounded-md hover:bg-white/5 bg-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2d2d2d] overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-medium">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-white">{user.username}</div>
            <div className="text-sm text-gray-400">
              {isIncoming ? 'Incoming Friend Request' : 'Outgoing Friend Request'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isIncoming ? (
            <>
              <Button
                size="icon"
                className="w-9 h-9 rounded-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onAccept?.(request.id)}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white"
                onClick={() => onDecline?.(request.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              className="px-4 h-9 text-sm hover:bg-white/10 text-white"
              onClick={() => onCancel?.(request.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}