
import { v4 as uuidv4 } from 'uuid';
import { Provider, MedicalRecord, ProviderType } from '@/types/medical';

// Mock data for medical providers
const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Metro General Hospital',
    type: 'hospital',
    address: '123 Healthcare Ave, Metro City, MC 12345',
    phone: '(555) 123-4567',
    email: 'info@metrogeneral.com',
    contactPerson: 'Dr. Sarah Johnson',
    notes: 'Primary hospital for emergency cases',
    createdAt: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
    updatedAt: new Date(Date.now() - 1728000000).toISOString(), // 20 days ago
  },
  {
    id: '2',
    name: 'City Chiropractic Center',
    type: 'chiropractor',
    address: '456 Wellness Blvd, Metro City, MC 12346',
    phone: '(555) 234-5678',
    email: 'appointments@citychiro.com',
    contactPerson: 'Dr. Michael Chen',
    notes: 'Specializes in spinal adjustments and rehabilitation',
    createdAt: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
    updatedAt: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
  },
  {
    id: '3',
    name: 'Oceanside Physical Therapy',
    type: 'physical therapy',
    address: '789 Rehab Road, Bayside, BS 54321',
    phone: '(555) 345-6789',
    email: 'care@oceansidept.com',
    contactPerson: 'James Wilson, PT',
    notes: 'Excellent for post-surgery rehabilitation',
    createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
    updatedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
  },
  {
    id: '4',
    name: 'Dr. Elizabeth Taylor',
    type: 'doctor',
    address: '101 Medical Plaza, Suite 200, Metro City, MC 12347',
    phone: '(555) 456-7890',
    email: 'drtaylor@metromedical.com',
    contactPerson: 'Lisa Rodriguez (Assistant)',
    notes: 'Orthopedic specialist, works with many personal injury cases',
    createdAt: new Date(Date.now() - 1296000000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: '5',
    name: 'Parkview Imaging Center',
    type: 'specialist',
    address: '222 Diagnostic Drive, Metro City, MC 12348',
    phone: '(555) 567-8901',
    email: 'schedule@parkviewimaging.com',
    contactPerson: 'Robert Johnson',
    notes: 'MRI, CT scans, X-rays, and other imaging services',
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  }
];

// Mock data for medical records
const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    caseId: 'case-001',
    clientId: '1',
    providerId: '1',
    providerName: 'Metro General Hospital',
    recordType: 'visit',
    title: 'Emergency Room Visit',
    description: 'Initial assessment after car accident. Patient presented with neck pain and mild concussion.',
    date: new Date(Date.now() - 6048000000).toISOString(), // 70 days ago
    documentIds: ['doc-001', 'doc-002'],
    amount: 1250.00,
    paid: true,
    paidBy: 'insurance',
    notes: 'Patient was discharged after 5 hours with neck brace and pain medication.',
    createdAt: new Date(Date.now() - 6048000000).toISOString(), // 70 days ago
    updatedAt: new Date(Date.now() - 6048000000).toISOString(), // 70 days ago
  },
  {
    id: '2',
    caseId: 'case-001',
    clientId: '1',
    providerId: '4',
    providerName: 'Dr. Elizabeth Taylor',
    recordType: 'visit',
    title: 'Follow-up Appointment',
    description: 'Follow-up examination for neck injury and concussion symptoms.',
    date: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
    documentIds: ['doc-003'],
    amount: 275.00,
    paid: true,
    paidBy: 'insurance',
    notes: 'Patient reported reduction in pain. Referred to physical therapy.',
    createdAt: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
    updatedAt: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
  },
  {
    id: '3',
    caseId: 'case-001',
    clientId: '1',
    providerId: '3',
    providerName: 'Oceanside Physical Therapy',
    recordType: 'treatment',
    title: 'Initial PT Assessment',
    description: 'Evaluation and initial treatment plan for neck injury.',
    date: new Date(Date.now() - 4320000000).toISOString(), // 50 days ago
    documentIds: ['doc-004'],
    amount: 185.00,
    paid: true,
    paidBy: 'insurance',
    notes: 'Treatment plan includes heat therapy, gentle stretching, and strengthening exercises.',
    createdAt: new Date(Date.now() - 4320000000).toISOString(), // 50 days ago
    updatedAt: new Date(Date.now() - 4320000000).toISOString(), // 50 days ago
  },
  {
    id: '4',
    caseId: 'case-001',
    clientId: '1',
    providerId: '5',
    providerName: 'Parkview Imaging Center',
    recordType: 'test',
    title: 'MRI Scan',
    description: 'MRI of cervical spine to evaluate extent of injury.',
    date: new Date(Date.now() - 3456000000).toISOString(), // 40 days ago
    documentIds: ['doc-005'],
    amount: 950.00,
    paid: false,
    notes: 'Billing insurance, approval pending.',
    createdAt: new Date(Date.now() - 3456000000).toISOString(), // 40 days ago
    updatedAt: new Date(Date.now() - 3456000000).toISOString(), // 40 days ago
  },
  {
    id: '5',
    caseId: 'case-002',
    clientId: '2',
    providerId: '2',
    providerName: 'City Chiropractic Center',
    recordType: 'treatment',
    title: 'Chiropractic Adjustment',
    description: 'Lower back adjustment following workplace injury.',
    date: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
    documentIds: ['doc-006'],
    amount: 125.00,
    paid: true,
    paidBy: 'client',
    notes: 'Patient reported immediate relief. Scheduled for follow-up in one week.',
    createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
    updatedAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
  }
];

// Medical API
export const medicalApi = {
  // Provider methods
  getProviders: async (): Promise<Provider[]> => {
    return [...mockProviders];
  },

  getProvider: async (id: string): Promise<Provider | null> => {
    const provider = mockProviders.find(provider => provider.id === id);
    return provider ? { ...provider } : null;
  },

  createProvider: async (providerData: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>): Promise<Provider> => {
    const now = new Date().toISOString();
    const newProvider: Provider = {
      ...providerData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    mockProviders.push(newProvider);
    return { ...newProvider };
  },

  updateProvider: async (id: string, providerData: Partial<Provider>): Promise<Provider | null> => {
    const providerIndex = mockProviders.findIndex(provider => provider.id === id);
    if (providerIndex === -1) return null;

    const updatedProvider = {
      ...mockProviders[providerIndex],
      ...providerData,
      updatedAt: new Date().toISOString(),
    };
    mockProviders[providerIndex] = updatedProvider;
    return { ...updatedProvider };
  },

  deleteProvider: async (id: string): Promise<boolean> => {
    const providerIndex = mockProviders.findIndex(provider => provider.id === id);
    if (providerIndex === -1) return false;

    mockProviders.splice(providerIndex, 1);
    return true;
  },

  // Medical record methods
  getMedicalRecords: async (): Promise<MedicalRecord[]> => {
    return [...mockMedicalRecords];
  },

  getMedicalRecordsByCaseId: async (caseId: string): Promise<MedicalRecord[]> => {
    return mockMedicalRecords.filter(record => record.caseId === caseId).map(record => ({ ...record }));
  },

  getMedicalRecordsByClientId: async (clientId: string): Promise<MedicalRecord[]> => {
    return mockMedicalRecords.filter(record => record.clientId === clientId).map(record => ({ ...record }));
  },

  getMedicalRecord: async (id: string): Promise<MedicalRecord | null> => {
    const record = mockMedicalRecords.find(record => record.id === id);
    return record ? { ...record } : null;
  },

  createMedicalRecord: async (recordData: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalRecord> => {
    const now = new Date().toISOString();
    const newRecord: MedicalRecord = {
      ...recordData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    mockMedicalRecords.push(newRecord);
    return { ...newRecord };
  },

  updateMedicalRecord: async (id: string, recordData: Partial<MedicalRecord>): Promise<MedicalRecord | null> => {
    const recordIndex = mockMedicalRecords.findIndex(record => record.id === id);
    if (recordIndex === -1) return null;

    const updatedRecord = {
      ...mockMedicalRecords[recordIndex],
      ...recordData,
      updatedAt: new Date().toISOString(),
    };
    mockMedicalRecords[recordIndex] = updatedRecord;
    return { ...updatedRecord };
  },

  deleteMedicalRecord: async (id: string): Promise<boolean> => {
    const recordIndex = mockMedicalRecords.findIndex(record => record.id === id);
    if (recordIndex === -1) return false;

    mockMedicalRecords.splice(recordIndex, 1);
    return true;
  },

  // Provider type methods
  getProviderTypes: async (): Promise<ProviderType[]> => {
    return ['hospital', 'clinic', 'doctor', 'chiropractor', 'physical therapy', 'specialist', 'pharmacy', 'other'];
  }
};
