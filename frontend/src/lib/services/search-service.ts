
import { Attorney } from '@/lib/api/attorneys-api';

// Define searchable content types
export type SearchableItem = {
  id: string;
  type: 'client' | 'case' | 'attorney' | 'document';
  title: string;
  subtitle?: string;
  route: string;
};

// Mock data for search - in a real app, this would come from your API
const mockSearchData: SearchableItem[] = [
  { id: '1', type: 'client', title: 'James Peterson', subtitle: 'Personal Injury', route: '/clients/1' },
  { id: '2', type: 'client', title: 'Maria Rodriguez', subtitle: 'Corporate Law', route: '/clients/2' },
  { id: '3', type: 'case', title: 'Peterson vs. Insurance Co', subtitle: 'Active', route: '/cases/1' },
  { id: '4', type: 'case', title: 'Rodriguez Real Estate Deal', subtitle: 'Pending', route: '/cases/2' },
  { id: '5', type: 'attorney', title: 'Rachel Green', subtitle: 'Partner', route: '/attorneys?tab=all' },
  { id: '6', type: 'attorney', title: 'Mark Johnson', subtitle: 'Associate', route: '/attorneys?tab=all' },
  { id: '7', type: 'document', title: 'Insurance Policy #123', subtitle: 'Peterson case', route: '/documents?tab=insurance' },
  { id: '8', type: 'document', title: 'Contract Draft', subtitle: 'Rodriguez case', route: '/documents?tab=lop' },
];

export const searchService = {
  // Search across all content types
  searchAll: async (query: string): Promise<SearchableItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query || query.trim() === '') {
      return [];
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return mockSearchData.filter(item => 
      item.title.toLowerCase().includes(normalizedQuery) || 
      item.subtitle?.toLowerCase().includes(normalizedQuery)
    );
  },
  
  // Get attorneys for search results
  getAttorneysForSearch: async (): Promise<SearchableItem[]> => {
    // In a real app, this would fetch from your API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockSearchData.filter(item => item.type === 'attorney');
  },
  
  // Get clients for search results
  getClientsForSearch: async (): Promise<SearchableItem[]> => {
    // In a real app, this would fetch from your API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockSearchData.filter(item => item.type === 'client');
  },
  
  // Get cases for search results
  getCasesForSearch: async (): Promise<SearchableItem[]> => {
    // In a real app, this would fetch from your API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockSearchData.filter(item => item.type === 'case');
  },
  
  // Get documents for search results
  getDocumentsForSearch: async (): Promise<SearchableItem[]> => {
    // In a real app, this would fetch from your API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockSearchData.filter(item => item.type === 'document');
  }
};
