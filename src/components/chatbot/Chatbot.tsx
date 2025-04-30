
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatbot } from '@/contexts/ChatbotContext';
import { Bot, Laptop, MessageCircle, Send, XCircle, Trash2, Loader2, HelpCircle, Info } from 'lucide-react';

const Chatbot: React.FC = () => {
  const { isOpen, messages, loading, sendMessage, closeChatbot, clearChat, currentRoute } = useChatbot();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Focus input when chatbot opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    
    await sendMessage(inputValue);
    setInputValue('');
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to close chatbot
      if (e.key === 'Escape' && isOpen) {
        closeChatbot();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeChatbot]);
  
  if (!isOpen) return null;
  
  const getCurrentPageName = () => {
    if (!currentRoute) return 'Home';
    return currentRoute.slice(1).charAt(0).toUpperCase() + currentRoute.slice(2) || 'Home';
  };
  
  // Generate context-aware suggestions based on current route
  const getRouteSuggestions = () => {
    const route = currentRoute?.toLowerCase() || '';
    
    if (route.includes('client')) {
      return [
        "How do I add a new client?",
        "What client information is required?",
        "How do I link cases to a client?"
      ];
    } else if (route.includes('case')) {
      return [
        "How do I create a new case?",
        "What documents are required for a case?",
        "How do I track case progress?"
      ];
    } else if (route.includes('bill') || route.includes('payment')) {
      return [
        "How do I create a new invoice?",
        "What billing features are available?",
        "How do I process a payment?"
      ];
    } else if (route.includes('document') || route.includes('file')) {
      return [
        "How do I upload documents?",
        "Where are client documents stored?",
        "Can I organize documents by category?"
      ];
    } else if (route.includes('calendar')) {
      return [
        "How do I create a new appointment?",
        "Can I set reminders for events?",
        "How do I share my calendar?"
      ];
    } else if (route.includes('deposition')) {
      return [
        "How do I schedule a deposition?",
        "What deposition transcripts are available?",
        "How do I add deposition notes?"
      ];
    } else if (route.includes('medical')) {
      return [
        "How do I add medical records?",
        "How can I organize patient treatments?",
        "Where are provider details stored?"
      ];
    } else if (route.includes('dashboard')) {
      return [
        "What information is shown on the dashboard?",
        "How do I customize my dashboard?",
        "What do the different charts mean?"
      ];
    } else if (route.includes('report')) {
      return [
        "What types of reports can I generate?",
        "How do I export report data?",
        "Can I schedule automatic reports?"
      ];
    } else if (route.includes('message')) {
      return [
        "How do I send messages to clients?",
        "Can I create message templates?",
        "Where are my past communications stored?"
      ];
    } else if (route.includes('setting')) {
      return [
        "How do I change my profile information?",
        "Where can I update notification settings?",
        "How do I manage security preferences?"
      ];
    } else if (route.includes('attorney')) {
      return [
        "How do I add a new attorney to the system?",
        "How can I view an attorney's caseload?",
        "How do I assign cases to attorneys?"
      ];
    } else if (route.includes('patient')) {
      return [
        "How do I add a new patient record?",
        "Where can I see patient medical history?",
        "How do I link patients to cases?"
      ];
    } else {
      // Default suggestions
      return [
        "Tell me about case management features",
        "How do I add a new client?",
        "What billing features are available?"
      ];
    }
  };
  
  // Get general app suggestions
  const getGeneralSuggestions = () => {
    return [
      "What can you help me with?",
      "How do I navigate this application?",
      "What features are available?"
    ];
  };
  
  return (
    <div className="fixed bottom-8 right-8 z-50 w-96 lg:w-[450px] shadow-xl">
      <Card className="overflow-hidden border-primary/10 bg-white">
        <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            AI LYZ Assistant
            {currentRoute && (
              <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                {getCurrentPageName()}
              </span>
            )}
          </CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-white/20" 
              onClick={() => clearChat()}
              disabled={loading}
              title="Clear chat history"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear chat</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/20" 
              onClick={() => closeChatbot()}
              title="Close chat"
            >
              <XCircle className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardHeader>
        
        <ScrollArea className="h-[450px] lg:h-[550px] py-4">
          <CardContent>
            <div className="flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto text-primary/40 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Welcome to AI LYZ Assistant</h3>
                  <p className="text-sm text-gray-500">
                    I can help you with all features of the LAW ERP 500 system. Ask me anything!
                  </p>
                  
                  {currentRoute && currentRoute !== '/' && currentRoute !== '/home' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-blue-700">
                            You're currently in the {getCurrentPageName()} section
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            I can provide specific help for this area
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 space-y-2">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      {currentRoute && currentRoute !== '/' && currentRoute !== '/home' 
                        ? `${getCurrentPageName()} Help` 
                        : 'Suggestions'}
                    </p>
                    {getRouteSuggestions().map((suggestion, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="w-full justify-start text-left text-sm" 
                        onClick={() => sendMessage(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                    
                    {(currentRoute && currentRoute !== '/' && currentRoute !== '/home') && (
                      <>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 mt-4">
                          General Help
                        </p>
                        {getGeneralSuggestions().map((suggestion, index) => (
                          <Button 
                            key={`general-${index}`}
                            variant="outline" 
                            className="w-full justify-start text-left text-sm" 
                            onClick={() => sendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className={`h-8 w-8 ${message.role === 'user' ? 'bg-blue-500' : 'bg-primary'}`}>
                    {message.role === 'user' ? (
                      <>
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/placeholder.svg" alt="AI Assistant" />
                        <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  <div 
                    className={`
                      rounded-lg px-4 py-3 max-w-[75%] text-sm
                      ${message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                      }
                    `}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </ScrollArea>
        
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              className="flex-1"
              aria-label="Chat message"
            />
            <Button 
              size="icon" 
              type="submit" 
              disabled={loading || !inputValue.trim()}
              className="h-10 w-10"
              title="Send message"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chatbot;
