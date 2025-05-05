
export interface ClientFilterParams {
  search?: string;
  tag?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface Client {
  id: string;
  accountNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  companyName?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  
  // Extended information from Patient model
  dateOfBirth?: string;
  profilePhoto?: string;
  caseStatus?: string;
  assignedAttorneyId?: string;
  accidentDate?: string;
  accidentLocation?: string;
  injuryType?: string;
  caseDescription?: string;
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insuranceAdjusterName?: string;
  dateRegistered?: string;
}
