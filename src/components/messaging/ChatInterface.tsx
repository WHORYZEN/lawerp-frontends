
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message, messagingApi } from '@/backend/messaging-api';
import { Skeleton } from "@/components/ui/skeleton";
import { Send } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from 'react-router-dom';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (recipient: string, content: string) => Promise<boolean>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSend }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('attorney1'); // Default to attorney1
  const [sending, setSending] = useState(false);
  const location = useLocation();
  
  // Check if we came from patient portal to contact attorney
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromPatient = params.get('fromPatient');
    const clientId = params.get('clientId');
    
    if (fromPatient && clientId) {
      setSelectedRecipient('attorney1'); // Set to attorney by default when coming from patient portal
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    const success = await onSend(selectedRecipient, newMessage);
    if (success) {
      setNewMessage('');
    }
    setSending(false);
  };

  // Mock recipients for demo purposes
  const recipients = [
    { id: 'attorney1', name: 'Jane Doelawyer (Your Attorney)' },
    { id: 'client1', name: 'John Client' },
    { id: 'client2', name: 'Sarah Patient' },
    { id: 'client3', name: 'Michael Case' },
  ];

  // Auto scroll to bottom of chat when new messages arrive
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="h-[600px] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a recipient" />
            </SelectTrigger>
            <SelectContent>
              {recipients.map(recipient => (
                <SelectItem key={recipient.id} value={recipient.id}>{recipient.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-10 w-[300px]" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => (
              <div key={message.id} className={`flex items-start gap-2 ${message.senderId === 'user1' ? 'justify-end' : ''}`}>
                {message.senderId !== 'user1' && (
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${message.senderId}`} />
                    <AvatarFallback>{message.senderId.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[70%] ${message.senderId === 'user1' ? 'bg-primary text-primary-foreground' : 'bg-muted'} p-3 rounded-lg`}>
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.senderId === 'user1' && (
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?u=user1" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <Separator />
      
      <form onSubmit={handleSubmit} className="p-4 flex gap-2">
        <Input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={sending || isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={sending || isLoading || !newMessage.trim()}>
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
