
import { Client } from '@/types/client';
import { MongoDBClient } from '../db/mongodb-local';

// Initialize MongoDB client
const mongoClient = MongoDBClient.getInstance();

// Connect to MongoDB when module is loaded
mongoClient.connect().catch(err => console.error('Failed to connect to MongoDB:', err));

// Client API methods
export const clientsApi = {
  // Get all clients
  getClients: async (): Promise<Client[]> => {
    try {
      return await mongoClient.getClients();
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  // Get a single client by ID
  getClient: async (id: string): Promise<Client | null> => {
    try {
      return await mongoClient.getClient(id);
    } catch (error) {
      console.error('Error fetching client:', error);
      return null;
    }
  },

  // Create a new client
  createClient: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client | null> => {
    try {
      return await mongoClient.createClient(clientData);
    } catch (error) {
      console.error('Error creating client:', error);
      return null;
    }
  },

  // Update an existing client
  updateClient: async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
    try {
      return await mongoClient.updateClient(id, clientData);
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  },

  // Delete a client
  deleteClient: async (id: string): Promise<boolean> => {
    try {
      return await mongoClient.deleteClient(id);
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
