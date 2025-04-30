
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useChatbot } from '@/contexts/ChatbotContext';
import { MessageCircle, HelpCircle, Bot } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const ChatbotButton: React.FC = () => {
  const { isOpen, openChatbot, setCurrentRoute } = useChatbot();
  const location = useLocation();
  const { toast } = useToast();
  
  // Update current route when location changes
  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname, setCurrentRoute]);
  
  // Notify users about the assistant when they first visit the site
  useEffect(() => {
    const hasSeenChatNotification = localStorage.getItem('hasSeenChatNotification');
    
    if (!hasSeenChatNotification && location.pathname !== '/login') {
      setTimeout(() => {
        toast({
          title: "Need help?",
          description: "Use the AI LYZ Assistant to get help with any feature.",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                openChatbot();
                localStorage.setItem('hasSeenChatNotification', 'true');
              }}
            >
              Open Assistant
            </Button>
          )
        });
      }, 3000);
    }
  }, [location.pathname, toast, openChatbot]);
  
  // Don't show button if chatbot is already open
  if (isOpen) return null;
  
  const handleOpenChat = () => {
    openChatbot();
    // Track usage for analytics
    try {
      console.log("Chatbot opened on route: ", location.pathname);
    } catch (error) {
      console.error("Error tracking chatbot open event", error);
    }
  };
  
  const isLandingPage = location.pathname === '/' || location.pathname === '/home';
  
  return (
    <Button
      onClick={handleOpenChat}
      className={`fixed bottom-8 right-8 z-40 rounded-full shadow-lg ${
        isLandingPage 
          ? 'w-auto px-4 py-6 bg-primary hover:bg-primary/90'
          : 'w-14 h-14 p-0 bg-primary hover:bg-primary/90 animate-pulse'
      }`}
    >
      {isLandingPage ? (
        <>
          <Bot className="h-5 w-5 mr-2" />
          <span>AI LYZ Assistant</span>
        </>
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
      <span className="sr-only">Open Chat Assistant</span>
    </Button>
  );
};

export default ChatbotButton;
