
import { Client } from './client';
import { Case } from './case';

export type DepositionStatus = 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';

export interface Deposition {
  id: string;
  clientId: string;
  client?: Client;
  caseId: string;
  case?: Case;
  attorneyId: string;
  attorneyName?: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  status: DepositionStatus;
  notes?: string;
  documentLink?: string;
  createdAt: string;
  updatedAt: string;
}

export type DepositionFormData = Omit<Deposition, 'id' | 'client' | 'case' | 'createdAt' | 'updatedAt'>;

export interface DepositionFilterParams {
  search: string;
  status?: DepositionStatus;
  clientId?: string;
  caseId?: string;
  attorneyId?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}
