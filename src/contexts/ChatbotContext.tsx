
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ChatbotMessage, chatbotApi } from '@/backend/chatbot-api';
import { useToast } from "@/hooks/use-toast";

interface ChatbotContextType {
  isOpen: boolean;
  messages: ChatbotMessage[];
  loading: boolean;
  sessionId: string | null;
  openChatbot: () => void;
  closeChatbot: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      setLoading(true);
      try {
        const savedSessionId = localStorage.getItem('chatbot_session_id');
        const session = await chatbotApi.getOrCreateSession(savedSessionId || undefined);
        
        // Save session ID
        setSessionId(session.id);
        localStorage.setItem('chatbot_session_id', session.id);
        
        // Set messages
        setMessages(session.messages);
      } catch (error) {
        console.error('Error initializing chatbot session:', error);
        toast({
          title: "Chatbot Error",
          description: "Failed to initialize chatbot. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    initSession();
  }, [toast]);

  const openChatbot = () => setIsOpen(true);
  
  const closeChatbot = () => setIsOpen(false);
  
  const sendMessage = async (content: string) => {
    if (!sessionId || !content.trim()) return;
    
    setLoading(true);
    try {
      // Add user message optimistically
      const tempUserMsg: ChatbotMessage = {
        id: 'temp-' + Date.now(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempUserMsg]);
      
      // Send to API
      const botResponse = await chatbotApi.sendMessage(sessionId, content);
      
      // Update messages with API response
      const sessionMessages = await chatbotApi.getSessionMessages(sessionId);
      setMessages(sessionMessages);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const clearChat = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    try {
      await chatbotApi.clearSession(sessionId);
      const newSession = await chatbotApi.getOrCreateSession();
      
      setSessionId(newSession.id);
      localStorage.setItem('chatbot_session_id', newSession.id);
      setMessages(newSession.messages);
      
      toast({
        title: "Chat Cleared",
        description: "Your conversation has been reset.",
      });
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast({
        title: "Error",
        description: "Failed to clear chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        messages,
        loading,
        sessionId,
        openChatbot,
        closeChatbot,
        sendMessage,
        clearChat
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
