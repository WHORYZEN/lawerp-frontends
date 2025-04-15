
import { Client } from '@/types/client';
import { Case } from '@/types/case';
import { MedicalRecord } from '@/types/medical';
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

// Case API methods
export const casesApi = {
  // Get all cases
  getCases: async (): Promise<Case[]> => {
    try {
      return await mongoClient.getCases();
    } catch (error) {
      console.error('Error fetching cases:', error);
      return [];
    }
  },

  // Get cases by client ID
  getCasesByClientId: async (clientId: string): Promise<Case[]> => {
    try {
      return await mongoClient.getCasesByClientId(clientId);
    } catch (error) {
      console.error('Error fetching client cases:', error);
      return [];
    }
  },

  // Get a single case by ID
  getCase: async (id: string): Promise<Case | null> => {
    try {
      return await mongoClient.getCase(id);
    } catch (error) {
      console.error('Error fetching case:', error);
      return null;
    }
  },

  // Create a new case
  createCase: async (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case | null> => {
    try {
      return await mongoClient.createCase(caseData);
    } catch (error) {
      console.error('Error creating case:', error);
      return null;
    }
  },

  // Update an existing case
  updateCase: async (id: string, caseData: Partial<Case>): Promise<Case | null> => {
    try {
      return await mongoClient.updateCase(id, caseData);
    } catch (error) {
      console.error('Error updating case:', error);
      return null;
    }
  },

  // Delete a case
  deleteCase: async (id: string): Promise<boolean> => {
    try {
      return await mongoClient.deleteCase(id);
    } catch (error) {
      console.error('Error deleting case:', error);
      return false;
    }
  },
};

// Medical Records API methods
export const medicalRecordsApi = {
  // Get all medical records
  getMedicalRecords: async (): Promise<MedicalRecord[]> => {
    try {
      return await mongoClient.getMedicalRecords();
    } catch (error) {
      console.error('Error fetching medical records:', error);
      return [];
    }
  },

  // Get medical records by case ID
  getMedicalRecordsByCaseId: async (caseId: string): Promise<MedicalRecord[]> => {
    try {
      return await mongoClient.getMedicalRecordsByCaseId(caseId);
    } catch (error) {
      console.error('Error fetching case medical records:', error);
      return [];
    }
  },

  // Get medical records by client ID
  getMedicalRecordsByClientId: async (clientId: string): Promise<MedicalRecord[]> => {
    try {
      return await mongoClient.getMedicalRecordsByClientId(clientId);
    } catch (error) {
      console.error('Error fetching client medical records:', error);
      return [];
    }
  },

  // Get a single medical record by ID
  getMedicalRecord: async (id: string): Promise<MedicalRecord | null> => {
    try {
      return await mongoClient.getMedicalRecord(id);
    } catch (error) {
      console.error('Error fetching medical record:', error);
      return null;
    }
  },

  // Create a new medical record
  createMedicalRecord: async (recordData: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalRecord | null> => {
    try {
      return await mongoClient.createMedicalRecord(recordData);
    } catch (error) {
      console.error('Error creating medical record:', error);
      return null;
    }
  },

  // Update an existing medical record
  updateMedicalRecord: async (id: string, recordData: Partial<MedicalRecord>): Promise<MedicalRecord | null> => {
    try {
      return await mongoClient.updateMedicalRecord(id, recordData);
    } catch (error) {
      console.error('Error updating medical record:', error);
      return null;
    }
  },

  // Delete a medical record
  deleteMedicalRecord: async (id: string): Promise<boolean> => {
    try {
      return await mongoClient.deleteMedicalRecord(id);
    } catch (error) {
      console.error('Error deleting medical record:', error);
      return false;
    }
  },
};
