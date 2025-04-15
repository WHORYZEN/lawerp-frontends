
import { v4 as uuidv4 } from 'uuid';

// Invoice types
export interface Invoice {
  id: string;
  clientId: string;
  caseId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'canceled';
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
}

// Settlement types
export interface Settlement {
  id: string;
  caseId: string;
  clientId: string;
  totalAmount: number;
  clientAmount: number;
  attorneyFees: number;
  medicalLiens: number;
  expenses: number;
  status: 'proposed' | 'accepted' | 'rejected' | 'finalized';
  createdAt: string;
  finalizedAt?: string;
}

// Letter types
export interface Letter {
  id: string;
  type: 'demand' | 'settlement' | 'lien_reduction';
  recipientId: string;
  caseId: string;
  content: string;
  status: 'draft' | 'sent' | 'responded';
  createdAt: string;
  sentAt?: string;
  respondedAt?: string;
}

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: 'invoice1',
    clientId: 'client1',
    caseId: 'case1',
    amount: 2500,
    status: 'pending',
    dueDate: new Date(Date.now() + 15 * 24 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    items: [
      {
        id: 'item1',
        description: 'Initial consultation',
        amount: 500,
        quantity: 1
      },
      {
        id: 'item2',
        description: 'Case preparation',
        amount: 2000,
        quantity: 1
      }
    ]
  },
  {
    id: 'invoice2',
    clientId: 'client2',
    caseId: 'case2',
    amount: 1800,
    status: 'paid',
    dueDate: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 3600000).toISOString(),
    paidAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
    items: [
      {
        id: 'item3',
        description: 'Document preparation',
        amount: 800,
        quantity: 1
      },
      {
        id: 'item4',
        description: 'Court appearance',
        amount: 1000,
        quantity: 1
      }
    ]
  },
  {
    id: 'invoice3',
    clientId: 'client3',
    caseId: 'case3',
    amount: 3200,
    status: 'overdue',
    dueDate: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 40 * 24 * 3600000).toISOString(),
    items: [
      {
        id: 'item5',
        description: 'Research',
        amount: 1200,
        quantity: 1
      },
      {
        id: 'item6',
        description: 'Deposition preparation',
        amount: 2000,
        quantity: 1
      }
    ]
  }
];

// Mock data for settlements
const mockSettlements: Settlement[] = [
  {
    id: 'settlement1',
    caseId: 'case1',
    clientId: 'client1',
    totalAmount: 50000,
    clientAmount: 33000,
    attorneyFees: 16500,
    medicalLiens: 0,
    expenses: 500,
    status: 'proposed',
    createdAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString()
  },
  {
    id: 'settlement2',
    caseId: 'case2',
    clientId: 'client2',
    totalAmount: 75000,
    clientAmount: 48750,
    attorneyFees: 25000,
    medicalLiens: 0,
    expenses: 1250,
    status: 'finalized',
    createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
    finalizedAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString()
  },
  {
    id: 'settlement3',
    caseId: 'case3',
    clientId: 'client3',
    totalAmount: 100000,
    clientAmount: 65000,
    attorneyFees: 33000,
    medicalLiens: 0,
    expenses: 2000,
    status: 'accepted',
    createdAt: new Date(Date.now() - 20 * 24 * 3600000).toISOString()
  }
];

// Mock data for letters
const mockLetters: Letter[] = [
  {
    id: 'letter1',
    type: 'demand',
    recipientId: 'insurance1',
    caseId: 'case1',
    content: 'Formal demand letter for case #1',
    status: 'sent',
    createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
    sentAt: new Date(Date.now() - 14 * 24 * 3600000).toISOString()
  },
  {
    id: 'letter2',
    type: 'settlement',
    recipientId: 'insurance2',
    caseId: 'case2',
    content: 'Settlement agreement for case #2',
    status: 'responded',
    createdAt: new Date(Date.now() - 35 * 24 * 3600000).toISOString(),
    sentAt: new Date(Date.now() - 34 * 24 * 3600000).toISOString(),
    respondedAt: new Date(Date.now() - 20 * 24 * 3600000).toISOString()
  },
  {
    id: 'letter3',
    type: 'lien_reduction',
    recipientId: 'hospital1',
    caseId: 'case3',
    content: 'Lien reduction request for case #3',
    status: 'draft',
    createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString()
  }
];

// Billing API
export const billingApi = {
  // Invoice Methods
  getInvoices: async (): Promise<Invoice[]> => {
    return mockInvoices;
  },

  getInvoicesByClient: async (clientId: string): Promise<Invoice[]> => {
    return mockInvoices.filter(invoice => invoice.clientId === clientId);
  },

  getInvoicesByCase: async (caseId: string): Promise<Invoice[]> => {
    return mockInvoices.filter(invoice => invoice.caseId === caseId);
  },

  getInvoice: async (id: string): Promise<Invoice | null> => {
    const invoice = mockInvoices.find(invoice => invoice.id === id);
    return invoice || null;
  },

  createInvoice: async (invoiceData: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    mockInvoices.push(newInvoice);
    return newInvoice;
  },

  updateInvoice: async (id: string, invoiceData: Partial<Invoice>): Promise<Invoice | null> => {
    const invoice = mockInvoices.find(invoice => invoice.id === id);
    if (invoice) {
      Object.assign(invoice, invoiceData);
      return invoice;
    }
    return null;
  },

  deleteInvoice: async (id: string): Promise<boolean> => {
    const index = mockInvoices.findIndex(invoice => invoice.id === id);
    if (index !== -1) {
      mockInvoices.splice(index, 1);
      return true;
    }
    return false;
  },

  markInvoiceAsPaid: async (id: string): Promise<Invoice | null> => {
    const invoice = mockInvoices.find(invoice => invoice.id === id);
    if (invoice) {
      invoice.status = 'paid';
      invoice.paidAt = new Date().toISOString();
      return invoice;
    }
    return null;
  },

  // Settlement Methods
  getSettlements: async (): Promise<Settlement[]> => {
    return mockSettlements;
  },

  getSettlementsByClient: async (clientId: string): Promise<Settlement[]> => {
    return mockSettlements.filter(settlement => settlement.clientId === clientId);
  },

  getSettlementsByCase: async (caseId: string): Promise<Settlement[]> => {
    return mockSettlements.filter(settlement => settlement.caseId === caseId);
  },

  getSettlement: async (id: string): Promise<Settlement | null> => {
    const settlement = mockSettlements.find(settlement => settlement.id === id);
    return settlement || null;
  },

  createSettlement: async (settlementData: Omit<Settlement, 'id' | 'createdAt'>): Promise<Settlement> => {
    const newSettlement: Settlement = {
      ...settlementData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    mockSettlements.push(newSettlement);
    return newSettlement;
  },

  updateSettlement: async (id: string, settlementData: Partial<Settlement>): Promise<Settlement | null> => {
    const settlement = mockSettlements.find(settlement => settlement.id === id);
    if (settlement) {
      Object.assign(settlement, settlementData);
      return settlement;
    }
    return null;
  },

  finalizeSettlement: async (id: string): Promise<Settlement | null> => {
    const settlement = mockSettlements.find(settlement => settlement.id === id);
    if (settlement) {
      settlement.status = 'finalized';
      settlement.finalizedAt = new Date().toISOString();
      return settlement;
    }
    return null;
  },

  // Letter Methods
  getLetters: async (): Promise<Letter[]> => {
    return mockLetters;
  },

  getLettersByCase: async (caseId: string): Promise<Letter[]> => {
    return mockLetters.filter(letter => letter.caseId === caseId);
  },

  getLetter: async (id: string): Promise<Letter | null> => {
    const letter = mockLetters.find(letter => letter.id === id);
    return letter || null;
  },

  createLetter: async (letterData: Omit<Letter, 'id' | 'createdAt'>): Promise<Letter> => {
    const newLetter: Letter = {
      ...letterData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    mockLetters.push(newLetter);
    return newLetter;
  },

  updateLetter: async (id: string, letterData: Partial<Letter>): Promise<Letter | null> => {
    const letter = mockLetters.find(letter => letter.id === id);
    if (letter) {
      Object.assign(letter, letterData);
      return letter;
    }
    return null;
  },

  sendLetter: async (id: string): Promise<Letter | null> => {
    const letter = mockLetters.find(letter => letter.id === id);
    if (letter) {
      letter.status = 'sent';
      letter.sentAt = new Date().toISOString();
      return letter;
    }
    return null;
  },

  markLetterAsResponded: async (id: string): Promise<Letter | null> => {
    const letter = mockLetters.find(letter => letter.id === id);
    if (letter) {
      letter.status = 'responded';
      letter.respondedAt = new Date().toISOString();
      return letter;
    }
    return null;
  }
};
