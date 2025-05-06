
export type ProviderType = 'hospital' | 'clinic' | 'doctor' | 'chiropractor' | 'physical therapy' | 'specialist' | 'pharmacy' | 'other';

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  caseId: string;
  clientId: string;
  providerId: string;
  providerName?: string;
  recordType: 'visit' | 'treatment' | 'test' | 'prescription' | 'discharge' | 'other';
  title: string;
  description?: string;
  date: string;
  documentIds?: string[];
  amount?: number;
  paid?: boolean;
  paidBy?: 'insurance' | 'client' | 'firm' | 'other';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MedicalRecordFormData = Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>;
