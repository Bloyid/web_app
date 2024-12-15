import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useSocket } from '@/lib/socket';

interface MessageInputProps {
  chatId: string;
}

export function MessageInput({ chatId }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const socket = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    socket.emit('send-message', {
      content: message,
      chatId
    });

    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-[#1a1a1a] border-gray-700"
        />
        <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb]">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}