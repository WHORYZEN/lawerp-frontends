
import { v4 as uuidv4 } from 'uuid';

// Message types
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'email' | 'sms' | 'chat';
}

// Chat types
export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastUpdated: string;
}

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'user1',
    recipientId: 'client1',
    content: 'Hello, how are you doing?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
    type: 'chat'
  },
  {
    id: '2',
    senderId: 'client1',
    recipientId: 'user1',
    content: 'I am doing well, thank you for asking!',
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    isRead: true,
    type: 'chat'
  },
  {
    id: '3',
    senderId: 'user1',
    recipientId: 'client2',
    content: 'Your case has been updated',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: false,
    type: 'email'
  },
  {
    id: '4',
    senderId: 'user1',
    recipientId: 'client3',
    content: 'Reminder: Your appointment is tomorrow at 2 PM',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    isRead: true,
    type: 'sms'
  }
];

// Mock data for chats
const mockChats: Chat[] = [
  {
    id: 'chat1',
    participants: ['user1', 'client1'],
    messages: [mockMessages[0], mockMessages[1]],
    lastUpdated: new Date(Date.now() - 3000000).toISOString()
  },
  {
    id: 'chat2',
    participants: ['user1', 'client2'],
    messages: [mockMessages[2]],
    lastUpdated: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'chat3',
    participants: ['user1', 'client3'],
    messages: [mockMessages[3]],
    lastUpdated: new Date(Date.now() - 43200000).toISOString()
  }
];

// Messaging API
export const messagingApi = {
  // Get all messages
  getMessages: async (type?: 'email' | 'sms' | 'chat'): Promise<Message[]> => {
    if (type) {
      return mockMessages.filter(message => message.type === type);
    }
    return mockMessages;
  },

  // Get message by id
  getMessage: async (id: string): Promise<Message | null> => {
    const message = mockMessages.find(message => message.id === id);
    return message || null;
  },

  // Send a new message
  sendMessage: async (message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    mockMessages.push(newMessage);
    
    // Update or create a chat for this message
    const existingChat = mockChats.find(chat => 
      chat.participants.includes(message.senderId) && 
      chat.participants.includes(message.recipientId)
    );
    
    if (existingChat) {
      existingChat.messages.push(newMessage);
      existingChat.lastUpdated = newMessage.timestamp;
    } else {
      const newChat: Chat = {
        id: uuidv4(),
        participants: [message.senderId, message.recipientId],
        messages: [newMessage],
        lastUpdated: newMessage.timestamp
      };
      mockChats.push(newChat);
    }
    
    return newMessage;
  },

  // Mark message as read
  markAsRead: async (id: string): Promise<boolean> => {
    const message = mockMessages.find(message => message.id === id);
    if (message) {
      message.isRead = true;
      return true;
    }
    return false;
  },

  // Get all chats
  getChats: async (): Promise<Chat[]> => {
    return mockChats;
  },

  // Get chat by id
  getChat: async (id: string): Promise<Chat | null> => {
    const chat = mockChats.find(chat => chat.id === id);
    return chat || null;
  },

  // Get chat by participants
  getChatByParticipants: async (participant1: string, participant2: string): Promise<Chat | null> => {
    const chat = mockChats.find(chat => 
      chat.participants.includes(participant1) && 
      chat.participants.includes(participant2)
    );
    return chat || null;
  }
};
