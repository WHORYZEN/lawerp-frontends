
export interface Client {
  id: string;
  accountNumber?: string;  // Added this field
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

export interface ClientFilterParams {
  search: string;
  tag?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}
