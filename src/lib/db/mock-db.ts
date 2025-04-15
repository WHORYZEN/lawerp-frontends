
import { Client } from '@/types/client';

// Try to load clients from localStorage
const getSavedClients = (): Client[] => {
  try {
    const savedClientsJson = localStorage.getItem('mockClients');
    if (savedClientsJson) {
      return JSON.parse(savedClientsJson);
    }
  } catch (error) {
    console.error('Error loading clients from localStorage:', error);
  }
  
  // Default mock data if nothing in localStorage
  return [
    {
      id: '1',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      companyName: 'Acme Inc.',
      address: '123 Main St, Anytown, USA',
      tags: ['personal injury', 'active'],
      notes: 'Returning client',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-03-20T15:45:00Z',
    },
    {
      id: '2',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      companyName: 'Smith LLC',
      tags: ['corporate', 'new'],
      createdAt: '2024-02-22T09:15:00Z',
      updatedAt: '2024-02-22T09:15:00Z',
    },
    {
      id: '3',
      fullName: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '(555) 456-7890',
      tags: ['personal injury', 'pending'],
      notes: 'Referred by Jane Smith',
      createdAt: '2024-03-10T14:20:00Z',
      updatedAt: '2024-04-05T11:30:00Z',
    },
  ];
};

// Initialize from localStorage or defaults
let mockClients = getSavedClients();

// Save clients to localStorage
const saveClients = () => {
  try {
    localStorage.setItem('mockClients', JSON.stringify(mockClients));
  } catch (error) {
    console.error('Error saving clients to localStorage:', error);
  }
};

// Helper functions to simulate delay and API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate async operations
export const mockDb = {
  clients: {
    getAll: async (): Promise<Client[]> => {
      await delay(300); // Simulate network delay
      return [...mockClients];
    },
    
    getById: async (id: string): Promise<Client | null> => {
      await delay(200);
      return mockClients.find(client => client.id === id) || null;
    },
    
    create: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
      await delay(300);
      const newClient: Client = {
        id: Math.random().toString(36).substring(2, 11),
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClients.push(newClient);
      saveClients(); // Save to localStorage
      return newClient;
    },
    
    update: async (id: string, data: Partial<Client>): Promise<Client | null> => {
      await delay(300);
      const index = mockClients.findIndex(client => client.id === id);
      if (index === -1) return null;
      
      mockClients[index] = {
        ...mockClients[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      saveClients(); // Save to localStorage
      return mockClients[index];
    },
    
    delete: async (id: string): Promise<boolean> => {
      await delay(200);
      const initialLength = mockClients.length;
      const index = mockClients.findIndex(client => client.id === id);
      if (index !== -1) {
        mockClients.splice(index, 1);
        saveClients(); // Save to localStorage
      }
      return initialLength > mockClients.length;
    },
  },
};
