
import { connectToDatabase } from '../db/mongodb';
import { Client } from '@/types/client';

export const clientsApi = {
  // Get all clients
  getClients: async (): Promise<Client[]> => {
    try {
      const { db } = await connectToDatabase();
      const clients = await db.collection('clients').find({}).toArray();
      return clients as Client[];
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  // Get a single client by ID
  getClient: async (id: string): Promise<Client | null> => {
    try {
      const { db } = await connectToDatabase();
      const client = await db.collection('clients').findOne({ id });
      return client as Client | null;
    } catch (error) {
      console.error('Error fetching client:', error);
      return null;
    }
  },

  // Create a new client
  createClient: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client | null> => {
    try {
      const { db } = await connectToDatabase();
      const newClient: Client = {
        id: crypto.randomUUID(),
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await db.collection('clients').insertOne(newClient);
      return newClient;
    } catch (error) {
      console.error('Error creating client:', error);
      return null;
    }
  },

  // Update an existing client
  updateClient: async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
    try {
      const { db } = await connectToDatabase();
      const updatedData = {
        ...clientData,
        updatedAt: new Date().toISOString(),
      };
      
      await db.collection('clients').updateOne({ id }, { $set: updatedData });
      const updatedClient = await db.collection('clients').findOne({ id });
      
      return updatedClient as Client | null;
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  },

  // Delete a client
  deleteClient: async (id: string): Promise<boolean> => {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('clients').deleteOne({ id });
      return result.deletedCount > 0;
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
