
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
    "The analytics charts on the Dashboard show your case distribution and client activity.",
    "The Dashboard is customizable - you can drag and rearrange widgets to suit your workflow.",
    "Click on any case in the Dashboard to view its detailed information."
  ],
  clients: [
    "You can manage all your clients from the Clients section.",
    "To add a new client, click the 'Add Client' button in the Clients section.",
    "Client profiles contain contact information, case history, and document access.",
    "You can filter clients by status, attorney assignment, or case type.",
    "The client communication log shows all emails, calls, and messages exchanged."
  ],
  cases: [
    "All active and closed cases are available in the Cases section.",
    "You can filter cases by status, type, or assigned attorney.",
    "Case details include client information, timeline, documents, and billing history.",
    "The case timeline shows all events, hearings, and deadlines in chronological order.",
    "You can link multiple clients to a single case when necessary."
  ],
  documents: [
    "The Documents section stores all client and case-related files.",
    "You can upload, download, and share documents securely.",
    "Document types include insurance documents, LOP, LOR, and bills.",
    "Our OCR technology automatically extracts key information from uploaded documents.",
    "You can organize documents with custom tags and categories."
  ],
  billing: [
    "Manage all invoices, settlements, and financial transactions in the Billing section.",
    "You can generate new invoices or payment requests from the Billing dashboard.",
    "The system automatically tracks payment status and outstanding balances.",
    "The billing calculator helps estimate fees and costs for new cases.",
    "You can export financial reports for accounting purposes."
  ],
  calendar: [
    "The Calendar shows all scheduled appointments, deadlines, and events.",
    "You can add new events directly by clicking on a date.",
    "Calendar events can be linked to specific cases and clients.",
    "You'll receive notifications for upcoming events and deadlines.",
    "The calendar syncs with popular platforms like Google Calendar and Outlook."
  ],
  messaging: [
    "The Messaging center allows you to communicate with clients and team members.",
    "You can send emails, SMS messages, or use the internal chat.",
    "Message templates are available for common communications.",
    "All client communications are automatically logged to their profile.",
    "You can schedule messages to be sent at specific times."
  ],
  medical: [
    "Medical records for all clients are stored in the Medical section.",
    "You can organize records by provider, date, or case.",
    "Medical record summaries are generated automatically for case reviews.",
    "You can track treatment progress and medical expenses over time.",
    "The system can identify potential discrepancies in medical billing."
  ],
  admin: [
    "The Admin section controls user permissions and system settings.",
    "You can add new users, assign roles, and modify access permissions.",
    "System logs and audit trails are available for compliance purposes.",
    "Configure firm-wide settings and preferences from the Admin panel.",
    "User activity reports help monitor system usage."
  ],
  calculator: [
    "The Calculator tool helps estimate settlement values and lien reductions.",
    "You can input medical bills, insurance coverage, and liability factors.",
    "The AI-powered calculator provides data-driven settlement recommendations.",
    "Historical settlement data is used to improve accuracy of estimates.",
    "You can save calculations to case files for future reference."
  ],
  settings: [
    "Customize your account preferences in the Settings section.",
    "You can update your profile, notification preferences, and security settings.",
    "System-wide settings are available for administrators.",
    "Customize your dashboard layout and widget preferences.",
    "Set up integrations with external services and platforms."
  ],
  depositions: [
    "The Depositions module lets you manage all your deposition transcripts and schedules.",
    "You can schedule new depositions and track their status.",
    "Upload and access deposition transcripts and related documents.",
    "Generate summary reports of depositions for case preparation.",
    "AI-powered analysis can identify key points from deposition transcripts."
  ],
  attorneys: [
    "The Attorneys section manages your firm's attorneys and their case assignments.",
    "You can add new attorneys, view their workload, and manage their profiles.",
    "The section shows case assignments and current workload for each attorney.",
    "Performance metrics help track attorney productivity and outcomes.",
    "You can balance workloads by reassigning cases between attorneys."
  ],
  patients: [
    "The Patients section contains medical information for all clients.",
    "You can track medical treatment history, providers, and records.",
    "Patient communication logs and appointment history are available here.",
    "You can monitor treatment progress and recovery status.",
    "Medical expenses are automatically calculated and linked to billing."
  ],
  files: [
    "The Files section provides file management for all case-related documents.",
    "You can organize files by case, client, or document type.",
    "Advanced search features help you find files quickly.",
    "Version control tracks document changes and updates.",
    "File permissions can be set to control access by team members."
  ],
  reports: [
    "Generate various reports about your firm's cases and performance.",
    "Medical reports and reduction statements are created in this section.",
    "You can export reports in multiple formats for presentations.",
    "Custom report templates can be created for specific needs.",
    "Scheduled reports can be automatically generated and distributed."
  ],
  help: [
    "For additional assistance, please contact our support team.",
    "Training videos and documentation are available in the Help section.",
    "You can also schedule a live training session for your team.",
    "Our knowledge base contains answers to frequently asked questions.",
    "The AI LYZ Assistant is available 24/7 to provide guidance on any feature."
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
  
  // Check for mentions of specific features and functions
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
  
  // AI Assistant self-reference
  if (queryLower.includes('ai') || queryLower.includes('assistant') || queryLower.includes('help') || 
      queryLower.includes('lyz') || queryLower.includes('chatbot')) {
    topics.push('help');
  }
  
  // If no specific topic is detected, return general help
  if (topics.length === 0) {
    topics.push('help');
  }
  
  return topics;
};

// Generate a more detailed response based on the user query
const generateResponse = (query: string, currentRoute?: string): string => {
  const topics = determineTopics(query, currentRoute);
  
  // Handle specific system questions
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('who are you') || queryLower.includes('what can you do') || 
      queryLower.includes('what is your name') || queryLower.includes('how can you help')) {
    return "I'm AI LYZ Assistant, your legal practice management helper. I can answer questions about all features of this application including clients, cases, billing, documents, calendar, and more. I'm here to make your legal practice management easier!";
  }
  
  if (queryLower.includes('how do i start') || queryLower.includes('getting started') || queryLower.includes('new user')) {
    return "Welcome to the LAW ERP 500 system! To get started, I recommend first exploring the Dashboard to get familiar with the overview. Then you can add your first client in the Clients section, create a case in the Cases section, and manage documents in the Documents section. Would you like me to guide you through any specific feature?";
  }
  
  // For topic-specific responses
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
      content: "Hello! I'm your AI LYZ Assistant. I can help you navigate all features of this application. What would you like to know about?",
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
