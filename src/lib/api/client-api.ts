
import apiClient from './api-client';
import { Client } from '@/types/client';

export const clientsApi = {
  // Get all clients
  getClients: async (): Promise<Client[]> => {
    try {
      const response = await apiClient.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  // Get a single client by ID
  getClient: async (id: string): Promise<Client | null> => {
    try {
      const response = await apiClient.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      return null;
    }
  },

  // Create a new client
  createClient: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client | null> => {
    try {
      const response = await apiClient.post('/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      return null;
    }
  },

  // Update an existing client
  updateClient: async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
    try {
      const response = await apiClient.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  },

  // Delete a client
  deleteClient: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/clients/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  },
};
