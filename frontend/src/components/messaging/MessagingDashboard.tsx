
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from '@/backend/messaging-api';
import { messagingApi } from '@/backend';
import ChatInterface from './ChatInterface';
import EmailLogs from './EmailLogs';
import SmsLogs from './SmsLogs';
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, MessageCircle, PlusCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const MessagingDashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Check if coming from patient portal
    const params = new URLSearchParams(location.search);
    const fromPatient = params.get('fromPatient');
    
    if (fromPatient) {
      setActiveTab('chat');
    }
  }, [location]);

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
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-lawfirm-dark-purple">Messaging</h1>
          <p className="text-lawfirm-neutral-gray mt-1">Manage all your client and team communications</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md"
            onClick={() => toast({
              title: "Coming Soon",
              description: "Message templates will be available in the next update.",
            })}
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Template</span>
          </button>
        </div>
      </div>
      
      <Card className="border-none shadow-lg bg-white overflow-hidden rounded-xl">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 pb-8 border-b border-blue-200">
          <CardTitle className="flex items-center gap-2 text-2xl text-blue-800">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            Communication Center
          </CardTitle>
          <CardDescription className="text-blue-700/80">
            Seamlessly connect with clients and team members through multiple channels
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200">
              <div className="px-6">
                <TabsList className="h-14 w-full bg-transparent justify-start gap-8 mb-[-1px]">
                  <TabsTrigger 
                    value="chat" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    <span>Live Chat</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="email" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all"
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    <span>Email</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sms" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    <span>SMS</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div>
              <TabsContent value="chat" className="m-0 p-0">
                <ChatInterface 
                  messages={messages.filter(m => m.type === 'chat')} 
                  isLoading={isLoading} 
                  onSend={(recipient, content) => handleSendMessage(recipient, content, 'chat')}
                />
              </TabsContent>
              
              <TabsContent value="email" className="m-0 p-0">
                <EmailLogs 
                  emails={messages.filter(m => m.type === 'email')} 
                  isLoading={isLoading} 
                  onSend={(recipient, content) => handleSendMessage(recipient, content, 'email')}
                />
              </TabsContent>
              
              <TabsContent value="sms" className="m-0 p-0">
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
