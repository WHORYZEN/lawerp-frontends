
import { Client } from '@/types/client';
import { mockDb } from './mock-db';

// This is a frontend-compatible MongoDB client wrapper
// In a production app, this would be replaced with actual API calls to a backend
export class MongoDBClient {
  private static instance: MongoDBClient;
  private isConnected: boolean = false;
  
  private constructor() {
    // Check if MongoDB URI is provided
    if (import.meta.env.VITE_MONGODB_URI) {
      console.log('MongoDB URI is configured. In a real backend, this would connect to MongoDB.');
      console.log('For frontend apps, you should use a backend API to connect to MongoDB.');
    } else {
      console.warn('MongoDB URI not configured. Using mock database.');
    }
  }

  public static getInstance(): MongoDBClient {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }
    return MongoDBClient.instance;
  }

  // Simulate MongoDB connection - in a real app, this would be handled by a backend
  public async connect(): Promise<boolean> {
    try {
      // In a frontend app, we can't actually connect to MongoDB directly
      // This is just to simulate the connection process
      this.isConnected = true;
      console.log('Mock MongoDB connection established');
      return true;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      this.isConnected = false;
      return false;
    }
  }

  // Get clients - in a real app, this would call a backend API
  public async getClients(): Promise<Client[]> {
    if (!this.isConnected) {
      await this.connect();
    }
    // In a frontend app, we use mock data
    return mockDb.clients.getAll();
  }

  // Get client by ID
  public async getClient(id: string): Promise<Client | null> {
    if (!this.isConnected) {
      await this.connect();
    }
    return mockDb.clients.getById(id);
  }

  // Create client
  public async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client | null> {
    if (!this.isConnected) {
      await this.connect();
    }
    return mockDb.clients.create(clientData);
  }

  // Update client
  public async updateClient(id: string, clientData: Partial<Client>): Promise<Client | null> {
    if (!this.isConnected) {
      await this.connect();
    }
    return mockDb.clients.update(id, clientData);
  }

  // Delete client
  public async deleteClient(id: string): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect();
    }
    return mockDb.clients.delete(id);
  }
}
