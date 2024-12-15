import { Message as MessageType } from '@/types';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        <span className="font-medium">{message.user.username}</span>
        <span className="text-xs text-gray-400">
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-gray-200">{message.content}</p>
    </div>
  );
}