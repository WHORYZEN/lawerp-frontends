
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useChatbot } from '@/contexts/ChatbotContext';
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ChatbotButton: React.FC = () => {
  const { isOpen, openChatbot, setCurrentRoute } = useChatbot();
  const location = useLocation();
  
  // Update current route when location changes
  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname, setCurrentRoute]);
  
  // Don't show button if chatbot is already open
  if (isOpen) return null;
  
  return (
    <Button
      onClick={openChatbot}
      className="fixed bottom-4 right-4 z-40 rounded-full w-12 h-12 p-0 shadow-lg bg-primary hover:bg-primary/90 animate-pulse"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="sr-only">Open Chat Assistant</span>
    </Button>
  );
};

export default ChatbotButton;
