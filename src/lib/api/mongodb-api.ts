import { Client } from '@/types/client';
import { mockDb } from '../db/mock-db';

// Use mock database for frontend development
// In a production app, this would be replaced with actual API calls to a backend
export const clientsApi = {
  // Get all clients
  getClients: async (): Promise<Client[]> => {
    try {
      return await mockDb.clients.getAll();
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  // Get a single client by ID
  getClient: async (id: string): Promise<Client | null> => {
    try {
      return await mockDb.clients.getById(id);
    } catch (error) {
      console.error('Error fetching client:', error);
      return null;
    }
  },

  // Create a new client
  createClient: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client | null> => {
    try {
      return await mockDb.clients.create(clientData);
    } catch (error) {
      console.error('Error creating client:', error);
      return null;
    }
  },

  // Update an existing client
  updateClient: async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
    try {
      return await mockDb.clients.update(id, clientData);
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  },

  // Delete a client
  deleteClient: async (id: string): Promise<boolean> => {
    try {
      return await mockDb.clients.delete(id);
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  },
};

// Similar API structure for Bills
export const billsApi = {
  // Implement bills API methods here
  // ...
};
