
// Backend API entry point
import { messagingApi } from './messaging-api';
import { adminApi } from './admin-api';
import { billingApi } from './billing-api';
import { settingsApi } from './settings-api';
import { medicalApi } from './medical-api';
import { depositionsApi } from '../lib/api/depositions-api';
import { attorneysApi } from '../lib/api/attorneys-api';
import { chatbotApi } from './chatbot-api';
import { clientsApi } from '../lib/api/client-api'; // Updated to use client-api instead of patients-api

// Create a compatibility layer so that existing patient components can work with clientsApi
export const patientsApi = {
  // Map client methods to patient methods
  getPatients: clientsApi.getClients,
  getPatient: clientsApi.getClient,
  createPatient: clientsApi.createClient,
  updatePatient: clientsApi.updateClient,
  deletePatient: clientsApi.deleteClient,
  getAppointments: clientsApi.getAppointments,
  getAppointmentsByStatus: clientsApi.getAppointmentsByStatus,
  getDocuments: clientsApi.getDocuments,
  getDocumentsByType: clientsApi.getDocumentsByType,
  getCommunications: clientsApi.getCommunications,
  markCommunicationAsRead: clientsApi.markCommunicationAsRead,
  getMissedAppointmentsCount: clientsApi.getMissedAppointmentsCount,
  getUpcomingAppointment: clientsApi.getUpcomingAppointment,
  getLastDocumentUploaded: clientsApi.getLastDocumentUploaded,
  getSmartNotifications: clientsApi.getSmartNotifications
};

// Export all backend APIs
export {
  messagingApi,
  adminApi,
  billingApi,
  settingsApi,
  medicalApi,
  clientsApi, // Export clientsApi instead of patientsApi
  depositionsApi,
  attorneysApi,
  chatbotApi
};
