import { useState, useEffect } from 'react';
import { Message } from '@/components/chat/Message';
import { MessageInput } from '@/components/chat/MessageInput';
import { useSocket } from '@/lib/socket';
import { Message as MessageType } from '@/types';

interface ChatWindowProps {
  chatId: string;
}

export function ChatWindow({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (newMessage: MessageType) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <MessageInput chatId={chatId} />
    </div>
  );
}