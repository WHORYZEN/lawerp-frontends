
import { Client } from './client';

export type CaseStatus = 'open' | 'pending' | 'closed' | 'settled';
export type CaseType = 'personal injury' | 'medical malpractice' | 'workers comp' | 'auto accident' | 'slip and fall' | 'other';

export interface Case {
  id: string;
  title: string;
  caseNumber: string;
  clientId: string;
  client?: Client;
  caseType: CaseType;
  status: CaseStatus;
  description?: string;
  assignedTo?: string[];
  openDate: string;
  closeDate?: string;
  courtDate?: string;
  statueOfLimitations?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CaseFormData = Omit<Case, 'id' | 'client' | 'createdAt' | 'updatedAt'>;

export interface CaseFilterParams {
  search: string;
  status?: CaseStatus;
  caseType?: CaseType;
  clientId?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export interface CaseTimelineEvent {
  id: string;
  caseId: string;
  title: string;
  description?: string;
  eventType: 'note' | 'document' | 'status' | 'court' | 'client' | 'settlement' | 'task';
  eventDate: string;
  createdBy: string;
  createdAt: string;
}
