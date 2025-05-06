
import { v4 as uuidv4 } from "uuid";
import { Deposition, DepositionFormData, DepositionStatus } from "@/types/deposition";

// This would connect to the MongoDB in a real implementation
// For now, we'll use local storage to simulate persistence
const STORAGE_KEY = "lyz_depositions";

// Initial mock data
const initialDepositions: Deposition[] = [
  {
    id: "1",
    clientId: "c1",
    caseId: "case1",
    attorneyId: "a1",
    attorneyName: "Sarah McCoy",
    title: "Car Crash Case Deposition",
    description: "Deposition for the witness in the car crash case",
    date: "2025-04-21T10:00:00",
    location: "Downtown Office, Conference Room A",
    status: "scheduled",
    notes: "Prepare questions about traffic light timing",
    createdAt: "2023-03-10T08:00:00",
    updatedAt: "2023-03-10T08:00:00"
  },
  {
    id: "2",
    clientId: "c2",
    caseId: "case2",
    attorneyId: "a2",
    attorneyName: "Dan Lee",
    title: "Slip & Fall Review",
    description: "Deposition of store manager regarding safety protocols",
    date: "2025-04-10T14:30:00",
    location: "Main Office, Room 302",
    status: "completed",
    notes: "Follow up on maintenance records",
    documentLink: "/documents/depo-2.pdf",
    createdAt: "2023-03-05T09:00:00",
    updatedAt: "2023-04-10T15:45:00"
  },
  {
    id: "3",
    clientId: "c3",
    caseId: "case3",
    attorneyId: "a3",
    attorneyName: "Jessica Miller",
    title: "Medical Malpractice Expert",
    description: "Expert witness deposition for medical standards",
    date: "2025-05-15T09:00:00",
    location: "Video Conference",
    status: "scheduled",
    notes: "Review medical charts before deposition",
    createdAt: "2023-04-01T10:30:00",
    updatedAt: "2023-04-01T10:30:00"
  },
  {
    id: "4",
    clientId: "c1",
    caseId: "case1",
    attorneyId: "a1",
    attorneyName: "Sarah McCoy",
    title: "Insurance Adjuster Testimony",
    description: "Deposition of insurance company representative",
    date: "2025-03-30T13:00:00",
    location: "Insurance Company HQ",
    status: "cancelled",
    notes: "Rescheduling needed due to scheduling conflict",
    createdAt: "2023-02-20T11:15:00",
    updatedAt: "2023-03-25T09:30:00"
  }
];

// Helper to load depositions from localStorage or use initial data
const loadDepositions = (): Deposition[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with mock data if no data exists
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDepositions));
    return initialDepositions;
  } catch (error) {
    console.error("Error loading depositions:", error);
    return initialDepositions;
  }
};

// Helper to save depositions to localStorage
const saveDepositions = (depositions: Deposition[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(depositions));
  } catch (error) {
    console.error("Error saving depositions:", error);
  }
};

// Depositions API
export const depositionsApi = {
  // Get all depositions
  getDepositions: async (): Promise<Deposition[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(loadDepositions());
      }, 300); // Simulated API delay
    });
  },

  // Get a single deposition by ID
  getDeposition: async (id: string): Promise<Deposition | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const depositions = loadDepositions();
        const deposition = depositions.find(d => d.id === id) || null;
        resolve(deposition);
      }, 300);
    });
  },

  // Create a new deposition
  createDeposition: async (data: DepositionFormData): Promise<Deposition> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const depositions = loadDepositions();
        const now = new Date().toISOString();
        
        const newDeposition: Deposition = {
          id: uuidv4(),
          ...data,
          createdAt: now,
          updatedAt: now
        };
        
        depositions.push(newDeposition);
        saveDepositions(depositions);
        resolve(newDeposition);
      }, 500);
    });
  },

  // Update an existing deposition
  updateDeposition: async (id: string, data: Partial<DepositionFormData>): Promise<Deposition | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const depositions = loadDepositions();
        const index = depositions.findIndex(d => d.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        const updatedDeposition: Deposition = {
          ...depositions[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        depositions[index] = updatedDeposition;
        saveDepositions(depositions);
        resolve(updatedDeposition);
      }, 500);
    });
  },

  // Delete a deposition
  deleteDeposition: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const depositions = loadDepositions();
        const filteredDepositions = depositions.filter(d => d.id !== id);
        
        if (filteredDepositions.length === depositions.length) {
          resolve(false);
          return;
        }
        
        saveDepositions(filteredDepositions);
        resolve(true);
      }, 500);
    });
  },
  
  // Filter depositions
  filterDepositions: async (params: {
    search?: string;
    status?: DepositionStatus;
    clientId?: string;
    caseId?: string;
    attorneyId?: string;
    dateRange?: { from?: Date; to?: Date };
  }): Promise<Deposition[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let depositions = loadDepositions();
        
        // Apply filters
        if (params.search) {
          const query = params.search.toLowerCase();
          depositions = depositions.filter(d => 
            d.title.toLowerCase().includes(query) ||
            d.description?.toLowerCase().includes(query) ||
            d.attorneyName?.toLowerCase().includes(query) ||
            d.location?.toLowerCase().includes(query)
          );
        }
        
        if (params.status) {
          depositions = depositions.filter(d => d.status === params.status);
        }
        
        if (params.clientId) {
          depositions = depositions.filter(d => d.clientId === params.clientId);
        }
        
        if (params.caseId) {
          depositions = depositions.filter(d => d.caseId === params.caseId);
        }
        
        if (params.attorneyId) {
          depositions = depositions.filter(d => d.attorneyId === params.attorneyId);
        }
        
        if (params.dateRange) {
          if (params.dateRange.from) {
            depositions = depositions.filter(d => 
              new Date(d.date) >= params.dateRange!.from!
            );
          }
          
          if (params.dateRange.to) {
            depositions = depositions.filter(d => 
              new Date(d.date) <= params.dateRange!.to!
            );
          }
        }
        
        resolve(depositions);
      }, 400);
    });
  },
  
  // Export depositions data
  exportDepositions: async (format: 'csv' | 'pdf' | 'json'): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const depositions = loadDepositions();
        
        if (format === 'json') {
          const blob = new Blob([JSON.stringify(depositions, null, 2)], {
            type: 'application/json'
          });
          resolve(URL.createObjectURL(blob));
        } else if (format === 'csv') {
          // Create CSV content
          const headers = "ID,Title,Date,Location,Attorney,Status\n";
          const rows = depositions.map(d => 
            `${d.id},"${d.title}","${new Date(d.date).toLocaleDateString()}","${d.location || ''}","${d.attorneyName || ''}","${d.status}"`
          ).join("\n");
          
          const blob = new Blob([headers + rows], { type: 'text/csv' });
          resolve(URL.createObjectURL(blob));
        } else {
          // Mock PDF export (in a real app, would use a PDF generation library)
          resolve('#');
        }
      }, 800);
    });
  }
};

// Update backend/index.ts to include the new depositions API
export const updateBackendIndex = () => {
  // This is just to indicate that in a real app, we would update the backend index
  console.log("Depositions API added to backend");
};
