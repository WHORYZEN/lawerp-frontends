
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from '@/backend/messaging-api';
import { messagingApi } from '@/backend';
import ChatInterface from './ChatInterface';
import EmailLogs from './EmailLogs';
import SmsLogs from './SmsLogs';
import { useToast } from "@/hooks/use-toast";

const MessagingDashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const type = activeTab === 'chat' ? 'chat' : activeTab === 'email' ? 'email' : 'sms';
        const fetchedMessages = await messagingApi.getMessages(type);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [activeTab, toast]);

  const handleSendMessage = async (recipient: string, content: string, type: 'email' | 'sms' | 'chat') => {
    try {
      const newMessage = await messagingApi.sendMessage({
        senderId: 'user1', // Current user ID
        recipientId: recipient,
        content: content,
        isRead: true,
        type: type
      });
      
      // Update the messages state if we're on the correct tab
      if (activeTab === type) {
        setMessages(prev => [...prev, newMessage]);
      }
      
      toast({
        title: "Message Sent",
        description: `Your ${type} has been sent successfully.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: `Failed to send ${type}. Please try again.`,
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Law EMR Messaging</CardTitle>
          <CardDescription>Manage all your client and team communications</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <TabsContent value="chat" className="m-0">
                <ChatInterface 
                  messages={messages.filter(m => m.type === 'chat')} 
                  isLoading={isLoading} 
                  onSend={(recipient, content) => handleSendMessage(recipient, content, 'chat')}
                />
              </TabsContent>
              
              <TabsContent value="email" className="m-0">
                <EmailLogs 
                  emails={messages.filter(m => m.type === 'email')} 
                  isLoading={isLoading} 
                  onSend={(recipient, content) => handleSendMessage(recipient, content, 'email')}
                />
              </TabsContent>
              
              <TabsContent value="sms" className="m-0">
                <SmsLogs 
                  messages={messages.filter(m => m.type === 'sms')} 
                  isLoading={isLoading} 
                  onSend={(recipient, content) => handleSendMessage(recipient, content, 'sms')}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingDashboard;
