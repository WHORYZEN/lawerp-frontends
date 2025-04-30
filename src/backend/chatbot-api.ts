
import { v4 as uuidv4 } from 'uuid';

// Message types
export interface ChatbotMessage {
  id: string;
  role: 'user' | 'bot' | 'system';
  content: string;
  timestamp: string;
}

// ChatBot session
export interface ChatbotSession {
  id: string;
  messages: ChatbotMessage[];
  lastUpdated: string;
}

// Features responses map by section
const responses: Record<string, string[]> = {
  dashboard: [
    "The Dashboard provides an overview of your firm's activity, including recent cases, upcoming events, and key metrics.",
    "You can find quick links to your most important tasks on the Dashboard.",
    "The analytics charts on the Dashboard show your case distribution and client activity."
  ],
  clients: [
    "You can manage all your clients from the Clients section.",
    "To add a new client, click the 'Add Client' button in the Clients section.",
    "Client profiles contain contact information, case history, and document access."
  ],
  cases: [
    "All active and closed cases are available in the Cases section.",
    "You can filter cases by status, type, or assigned attorney.",
    "Case details include client information, timeline, documents, and billing history."
  ],
  documents: [
    "The Documents section stores all client and case-related files.",
    "You can upload, download, and share documents securely.",
    "Document types include insurance documents, LOP, LOR, and bills."
  ],
  billing: [
    "Manage all invoices, settlements, and financial transactions in the Billing section.",
    "You can generate new invoices or payment requests from the Billing dashboard.",
    "The system automatically tracks payment status and outstanding balances."
  ],
  calendar: [
    "The Calendar shows all scheduled appointments, deadlines, and events.",
    "You can add new events directly by clicking on a date.",
    "Calendar events can be linked to specific cases and clients."
  ],
  messaging: [
    "The Messaging center allows you to communicate with clients and team members.",
    "You can send emails, SMS messages, or use the internal chat.",
    "Message templates are available for common communications."
  ],
  medical: [
    "Medical records for all clients are stored in the Medical section.",
    "You can organize records by provider, date, or case.",
    "Medical record summaries are generated automatically for case reviews."
  ],
  admin: [
    "The Admin section controls user permissions and system settings.",
    "You can add new users, assign roles, and modify access permissions.",
    "System logs and audit trails are available for compliance purposes."
  ],
  calculator: [
    "The Calculator tool helps estimate settlement values and lien reductions.",
    "You can input medical bills, insurance coverage, and liability factors.",
    "The AI-powered calculator provides data-driven settlement recommendations."
  ],
  settings: [
    "Customize your account preferences in the Settings section.",
    "You can update your profile, notification preferences, and security settings.",
    "System-wide settings are available for administrators."
  ],
  depositions: [
    "The Depositions module lets you manage all your deposition transcripts and schedules.",
    "You can schedule new depositions and track their status.",
    "Upload and access deposition transcripts and related documents.",
    "Generate summary reports of depositions for case preparation."
  ],
  attorneys: [
    "The Attorneys section manages your firm's attorneys and their case assignments.",
    "You can add new attorneys, view their workload, and manage their profiles.",
    "The section shows case assignments and current workload for each attorney."
  ],
  patients: [
    "The Patients section contains medical information for all clients.",
    "You can track medical treatment history, providers, and records.",
    "Patient communication logs and appointment history are available here."
  ],
  files: [
    "The Files section provides file management for all case-related documents.",
    "You can organize files by case, client, or document type.",
    "Advanced search features help you find files quickly."
  ],
  reports: [
    "Generate various reports about your firm's cases and performance.",
    "Medical reports and reduction statements are created in this section.",
    "You can export reports in multiple formats for presentations."
  ],
  help: [
    "For additional assistance, please contact our support team.",
    "Training videos and documentation are available in the Help section.",
    "You can also schedule a live training session for your team."
  ]
};

// Active sessions
const activeSessions: Record<string, ChatbotSession> = {};

// Function to analyze user query and determine the topic
const determineTopics = (query: string, currentRoute?: string): string[] => {
  const topics: string[] = [];
  const queryLower = query.toLowerCase();
  
  // First check if the query is about the current route
  if (currentRoute) {
    const routeName = currentRoute.replace('/', '').toLowerCase();
    if (routeName && responses[routeName]) {
      topics.push(routeName);
    }
  }
  
  if (queryLower.includes('dashboard') || queryLower.includes('overview') || queryLower.includes('home')) {
    topics.push('dashboard');
  }
  if (queryLower.includes('client') || queryLower.includes('customer') || queryLower.includes('contact')) {
    topics.push('clients');
  }
  if (queryLower.includes('case') || queryLower.includes('lawsuit') || queryLower.includes('matter') || queryLower.includes('file')) {
    topics.push('cases');
  }
  if (queryLower.includes('document') || queryLower.includes('file') || queryLower.includes('paperwork')) {
    topics.push('documents');
  }
  if (queryLower.includes('bill') || queryLower.includes('invoice') || queryLower.includes('payment') || queryLower.includes('settlement')) {
    topics.push('billing');
  }
  if (queryLower.includes('calendar') || queryLower.includes('schedule') || queryLower.includes('appointment') || queryLower.includes('event')) {
    topics.push('calendar');
  }
  if (queryLower.includes('message') || queryLower.includes('email') || queryLower.includes('sms') || queryLower.includes('chat') || queryLower.includes('communication')) {
    topics.push('messaging');
  }
  if (queryLower.includes('medical') || queryLower.includes('health') || queryLower.includes('records') || queryLower.includes('doctor') || queryLower.includes('treatment')) {
    topics.push('medical');
  }
  if (queryLower.includes('admin') || queryLower.includes('permission') || queryLower.includes('user') || queryLower.includes('role')) {
    topics.push('admin');
  }
  if (queryLower.includes('calculat') || queryLower.includes('estimate') || queryLower.includes('value')) {
    topics.push('calculator');
  }
  if (queryLower.includes('setting') || queryLower.includes('preference') || queryLower.includes('configuration')) {
    topics.push('settings');
  }
  if (queryLower.includes('deposition') || queryLower.includes('transcript') || queryLower.includes('testimony')) {
    topics.push('depositions');
  }
  if (queryLower.includes('attorney') || queryLower.includes('lawyer') || queryLower.includes('counsel')) {
    topics.push('attorneys');
  }
  if (queryLower.includes('patient') || queryLower.includes('treatment') || queryLower.includes('medical history')) {
    topics.push('patients');
  }
  if (queryLower.includes('report') || queryLower.includes('analytics') || queryLower.includes('statistics')) {
    topics.push('reports');
  }
  
  // If no specific topic is detected, return general help
  if (topics.length === 0) {
    topics.push('help');
  }
  
  return topics;
};

// Generate a response based on the user query
const generateResponse = (query: string, currentRoute?: string): string => {
  const topics = determineTopics(query, currentRoute);
  
  if (topics.length === 1) {
    const topic = topics[0];
    const topicResponses = responses[topic];
    const randomResponse = topicResponses[Math.floor(Math.random() * topicResponses.length)];
    return randomResponse;
  } else {
    // If multiple topics are detected, provide a combined response
    let response = "I found information related to multiple topics:\n\n";
    topics.forEach(topic => {
      const topicResponses = responses[topic];
      const randomResponse = topicResponses[Math.floor(Math.random() * topicResponses.length)];
      response += `Regarding ${topic}: ${randomResponse}\n\n`;
    });
    return response;
  }
};

// Extract route context from messages
const getCurrentRouteFromMessages = (messages: ChatbotMessage[]): string | undefined => {
  for (const message of messages) {
    if (message.role === 'system' && message.content.includes("I'm currently on the")) {
      const match = message.content.match(/I'm currently on the (\w+) page/);
      if (match && match[1]) {
        return match[1].toLowerCase();
      }
    }
  }
  return undefined;
};

// Chatbot API
export const chatbotApi = {
  // Get or create a session
  getOrCreateSession: async (sessionId?: string): Promise<ChatbotSession> => {
    // If session exists, return it
    if (sessionId && activeSessions[sessionId]) {
      return activeSessions[sessionId];
    }
    
    // Otherwise create a new session
    const newSessionId = sessionId || uuidv4();
    const welcomeMessage: ChatbotMessage = {
      id: uuidv4(),
      role: 'bot',
      content: "Hello! I'm your law firm assistant. How can I help you today?",
      timestamp: new Date().toISOString()
    };
    
    const newSession: ChatbotSession = {
      id: newSessionId,
      messages: [welcomeMessage],
      lastUpdated: new Date().toISOString()
    };
    
    activeSessions[newSessionId] = newSession;
    return newSession;
  },
  
  // Send a message
  sendMessage: async (sessionId: string, content: string, isSystem: boolean = false): Promise<ChatbotMessage> => {
    // Get or create session
    const session = await chatbotApi.getOrCreateSession(sessionId);
    
    // Create user message
    const userMessage: ChatbotMessage = {
      id: uuidv4(),
      role: isSystem ? 'system' : 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    // Add message to session
    session.messages.push(userMessage);
    
    // Don't respond to system messages with bot messages
    if (isSystem) {
      return userMessage;
    }
    
    // Get current route context from messages
    const currentRoute = getCurrentRouteFromMessages(session.messages);
    
    // Generate bot response
    const responseContent = generateResponse(content, currentRoute);
    const botMessage: ChatbotMessage = {
      id: uuidv4(),
      role: 'bot',
      content: responseContent,
      timestamp: new Date().toISOString()
    };
    
    // Add bot message to session
    session.messages.push(botMessage);
    session.lastUpdated = new Date().toISOString();
    
    return botMessage;
  },
  
  // Get session messages
  getSessionMessages: async (sessionId: string): Promise<ChatbotMessage[]> => {
    const session = await chatbotApi.getOrCreateSession(sessionId);
    return session.messages.filter(msg => msg.role !== 'system'); // Filter out system messages for display
  },
  
  // Clear session
  clearSession: async (sessionId: string): Promise<boolean> => {
    if (activeSessions[sessionId]) {
      delete activeSessions[sessionId];
      return true;
    }
    return false;
  }
};
