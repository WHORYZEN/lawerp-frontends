
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatbot } from '@/contexts/ChatbotContext';
import { Bot, Laptop, MessageCircle, Send, XCircle, Trash2, Loader2 } from 'lucide-react';

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
  
  if (!isOpen) return null;
  
  const getCurrentPageName = () => {
    if (!currentRoute) return 'Home';
    return currentRoute.slice(1).charAt(0).toUpperCase() + currentRoute.slice(2) || 'Home';
  };
  
  return (
    <div className="fixed bottom-8 right-8 z-50 w-96 lg:w-[450px] shadow-xl">
      <Card className="overflow-hidden border-primary/10 bg-white">
        <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            LawAssistant
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
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear chat</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/20" 
              onClick={() => closeChatbot()}
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
                  <Laptop className="h-12 w-12 mx-auto text-primary/40 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Welcome to LawAssistant</h3>
                  <p className="text-sm text-gray-500">
                    How can I help you with your legal practice today?
                  </p>
                  <div className="mt-6 space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left" 
                      onClick={() => sendMessage("Tell me about case management features")}
                    >
                      Tell me about case management features
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left" 
                      onClick={() => sendMessage("How do I add a new client?")}
                    >
                      How do I add a new client?
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left" 
                      onClick={() => sendMessage("What billing features are available?")}
                    >
                      What billing features are available?
                    </Button>
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
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>U</AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/placeholder.svg" />
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
            />
            <Button 
              size="icon" 
              type="submit" 
              disabled={loading || !inputValue.trim()}
              className="h-10 w-10"
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
