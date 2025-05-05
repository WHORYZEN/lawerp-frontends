import apiClient from './api-client';
import { Client } from '@/types/client';
import { v4 as uuidv4 } from 'uuid';

// Define additional types from patient model
export interface Appointment {
  id: string;
  clientId: string;
  doctorFacilityName: string;
  visitDate: string;
  visitTime: string;
  visitStatus: 'completed' | 'missed' | 'scheduled';
  treatmentDescription?: string;
  location: string;
  type: string;
}

export interface Document {
  id: string;
  clientId: string;
  name: string;
  type: 'medical' | 'legal' | 'billing' | 'misc';
  category: string;
  uploadDate: string;
  fileType: string;
  url: string;
  uploadedBy: string;
}

export interface Communication {
  id: string;
  clientId: string;
  date: string;
  time: string;
  type: 'email' | 'sms' | 'phone';
  sender: string;
  subject: string;
  content: string;
  read: boolean;
  actionRequired: boolean;
}

// Mock data for clients with extended patient information
const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    clientId: 'client1',
    doctorFacilityName: 'Dr. Michael Johnson',
    visitDate: '2025-05-10',
    visitTime: '10:30 AM',
    visitStatus: 'scheduled',
    treatmentDescription: 'Follow-up consultation',
    location: 'PT Associates',
    type: 'Physical Therapy'
  },
  // Other mock appointments can be added here
];

const mockDocuments: Document[] = [
  {
    id: 'doc1',
    clientId: 'client1',
    name: 'Initial Medical Evaluation',
    type: 'medical',
    category: 'Medical Reports',
    uploadDate: '2025-04-05',
    fileType: 'pdf',
    url: '/documents/initial-evaluation.pdf',
    uploadedBy: 'Dr. Smith'
  },
  // Other mock documents can be added here
];

const mockCommunications: Communication[] = [
  {
    id: 'comm1',
    clientId: 'client1',
    date: '2025-04-20',
    time: '10:15 AM',
    type: 'email',
    sender: 'Jane Doelawyer',
    subject: 'Case Update - Treatment Progress',
    content: 'Your case is progressing as expected. We have submitted your initial medical records...',
    read: true,
    actionRequired: false
  },
  // Other mock communications can be added here
];

export const clientsApi = {
  // Original client methods
  getClients: async (): Promise<Client[]> => {
    try {
      const response = await apiClient.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  getClient: async (id: string): Promise<Client | null> => {
    try {
      const response = await apiClient.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      return null;
    }
  },

  createClient: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client | null> => {
    try {
      const response = await apiClient.post('/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      return null;
    }
  },

  updateClient: async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
    try {
      const response = await apiClient.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  },

  deleteClient: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/clients/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  },

  // Additional patient-related methods
  getAppointments: async (clientId: string): Promise<Appointment[]> => {
    // Mock implementation using the mock data
    return mockAppointments.filter(apt => apt.clientId === clientId);
  },

  getAppointmentsByStatus: async (clientId: string, status: string): Promise<Appointment[]> => {
    return mockAppointments.filter(apt => apt.clientId === clientId && apt.visitStatus === status);
  },

  getDocuments: async (clientId: string): Promise<Document[]> => {
    return mockDocuments.filter(doc => doc.clientId === clientId);
  },

  getDocumentsByType: async (clientId: string, type: string): Promise<Document[]> => {
    return mockDocuments.filter(doc => doc.clientId === clientId && doc.type === type);
  },

  getCommunications: async (clientId: string): Promise<Communication[]> => {
    return mockCommunications.filter(comm => comm.clientId === clientId);
  },

  markCommunicationAsRead: async (communicationId: string): Promise<Communication | null> => {
    const index = mockCommunications.findIndex(comm => comm.id === communicationId);
    if (index !== -1) {
      mockCommunications[index].read = true;
      return mockCommunications[index];
    }
    return null;
  },

  getMissedAppointmentsCount: async (clientId: string): Promise<number> => {
    return mockAppointments.filter(apt => apt.clientId === clientId && apt.visitStatus === 'missed').length;
  },

  getUpcomingAppointment: async (clientId: string): Promise<Appointment | null> => {
    const upcomingAppointments = mockAppointments
      .filter(apt => apt.clientId === clientId && apt.visitStatus === 'scheduled')
      .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());
    
    return upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
  },

  getLastDocumentUploaded: async (clientId: string): Promise<Document | null> => {
    const documents = mockDocuments
      .filter(doc => doc.clientId === clientId)
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    
    return documents.length > 0 ? documents[0] : null;
  },

  getSmartNotifications: async (clientId: string): Promise<string[]> => {
    const notifications: string[] = [];
    
    // Check for missed appointments
    const missedCount = await clientsApi.getMissedAppointmentsCount(clientId);
    if (missedCount > 0) {
      notifications.push(`Client has missed ${missedCount} appointment(s). Please contact to reschedule.`);
    }
    
    // Check for upcoming appointments
    const upcomingAppointment = await clientsApi.getUpcomingAppointment(clientId);
    if (upcomingAppointment) {
      const appointmentDate = new Date(upcomingAppointment.visitDate);
      const today = new Date();
      const daysUntil = Math.ceil((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= 7) {
        notifications.push(`Next appointment is in ${daysUntil} day(s) on ${upcomingAppointment.visitDate} at ${upcomingAppointment.visitTime}.`);
      }
    }
    
    return notifications;
  }
};
