
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';
import { 
  FileText, 
  User, 
  Scale, 
  Building, 
  Calendar, 
  MessageSquare, 
  Receipt, 
  Folder, 
  BookOpen,
  Pencil
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the search result types
export type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  type: 'client' | 'attorney' | 'case' | 'document' | 'file' | 'deposition' | 'billing' | 'calendar' | 'message';
  icon: React.ReactNode;
  route: string;
};

// Mock search data for demonstration
const mockSearchData: SearchResult[] = [
  // Clients
  { id: 'client-1', title: 'James Peterson', subtitle: 'Personal Injury Client', type: 'client', icon: <User className="h-4 w-4 text-blue-500" />, route: '/clients/1' },
  { id: 'client-2', title: 'Maria Rodriguez', subtitle: 'Corporate Law Client', type: 'client', icon: <User className="h-4 w-4 text-blue-500" />, route: '/clients/2' },
  { id: 'client-3', title: 'Robert Johnson', subtitle: 'Estate Planning Client', type: 'client', icon: <User className="h-4 w-4 text-blue-500" />, route: '/clients/3' },
  
  // Attorneys
  { id: 'attorney-1', title: 'Rachel Green', subtitle: 'Partner - Corporate Law', type: 'attorney', icon: <Pencil className="h-4 w-4 text-purple-500" />, route: '/attorneys?tab=all' },
  { id: 'attorney-2', title: 'Mark Johnson', subtitle: 'Associate - Litigation', type: 'attorney', icon: <Pencil className="h-4 w-4 text-purple-500" />, route: '/attorneys?tab=associates' },
  { id: 'attorney-3', title: 'Sarah Williams', subtitle: 'Paralegal - Family Law', type: 'attorney', icon: <Pencil className="h-4 w-4 text-purple-500" />, route: '/attorneys?tab=paralegals' },
  
  // Cases
  { id: 'case-1', title: 'Peterson vs. Insurance Co', subtitle: 'Active - Personal Injury', type: 'case', icon: <Scale className="h-4 w-4 text-green-500" />, route: '/cases/1' },
  { id: 'case-2', title: 'Rodriguez Corporate Merger', subtitle: 'Active - Corporate Law', type: 'case', icon: <Scale className="h-4 w-4 text-green-500" />, route: '/cases/2' },
  { id: 'case-3', title: 'Johnson Estate Planning', subtitle: 'Completed - Estate Law', type: 'case', icon: <Scale className="h-4 w-4 text-green-500" />, route: '/cases/3' },
  
  // Documents
  { id: 'doc-1', title: 'Insurance Policy #123', subtitle: 'Peterson case - Insurance', type: 'document', icon: <FileText className="h-4 w-4 text-orange-500" />, route: '/documents?tab=insurance' },
  { id: 'doc-2', title: 'Merger Agreement Draft', subtitle: 'Rodriguez case - Contract', type: 'document', icon: <FileText className="h-4 w-4 text-orange-500" />, route: '/documents?tab=contracts' },
  { id: 'doc-3', title: 'Will and Testament', subtitle: 'Johnson case - Estate', type: 'document', icon: <FileText className="h-4 w-4 text-orange-500" />, route: '/documents?tab=general' },
  
  // Files
  { id: 'file-1', title: 'Medical Records - Peterson', subtitle: 'PDF Document - 2.5 MB', type: 'file', icon: <Folder className="h-4 w-4 text-yellow-500" />, route: '/files?q=peterson' },
  { id: 'file-2', title: 'Financial Report - Rodriguez Corp', subtitle: 'Excel Document - 1.8 MB', type: 'file', icon: <Folder className="h-4 w-4 text-yellow-500" />, route: '/files?q=rodriguez' },
  
  // Depositions
  { id: 'depo-1', title: 'Peterson Medical Deposition', subtitle: 'Scheduled - May 15, 2023', type: 'deposition', icon: <BookOpen className="h-4 w-4 text-indigo-500" />, route: '/depositions/1' },
  { id: 'depo-2', title: 'Rodriguez Financial Deposition', subtitle: 'Completed - April 10, 2023', type: 'deposition', icon: <BookOpen className="h-4 w-4 text-indigo-500" />, route: '/depositions/2' },
  
  // Calendar
  { id: 'cal-1', title: 'Court Hearing - Peterson', subtitle: 'May 20, 2023 - 10:00 AM', type: 'calendar', icon: <Calendar className="h-4 w-4 text-red-500" />, route: '/calendar?date=2023-05-20' },
  { id: 'cal-2', title: 'Client Meeting - Rodriguez', subtitle: 'May 12, 2023 - 2:30 PM', type: 'calendar', icon: <Calendar className="h-4 w-4 text-red-500" />, route: '/calendar?date=2023-05-12' },
  
  // Billing
  { id: 'bill-1', title: 'Invoice #INV-2023-042', subtitle: 'Peterson - $1,500.00', type: 'billing', icon: <Receipt className="h-4 w-4 text-emerald-500" />, route: '/billing?invoice=INV-2023-042' },
  { id: 'bill-2', title: 'Invoice #INV-2023-039', subtitle: 'Rodriguez Corp - $3,200.00', type: 'billing', icon: <Receipt className="h-4 w-4 text-emerald-500" />, route: '/billing?invoice=INV-2023-039' },
  
  // Messages
  { id: 'msg-1', title: 'Message from James Peterson', subtitle: 'Received - Yesterday', type: 'message', icon: <MessageSquare className="h-4 w-4 text-sky-500" />, route: '/messages?contact=james-peterson' },
  { id: 'msg-2', title: 'Message from Maria Rodriguez', subtitle: 'Received - 2 days ago', type: 'message', icon: <MessageSquare className="h-4 w-4 text-sky-500" />, route: '/messages?contact=maria-rodriguez' },
];

interface CommandSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandSearch: React.FC<CommandSearchProps> = ({ open, onOpenChange }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter results based on search query
  useEffect(() => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    const filteredResults = mockSearchData.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      (item.subtitle && item.subtitle.toLowerCase().includes(lowerQuery)) ||
      item.type.toLowerCase().includes(lowerQuery)
    );
    
    setSearchResults(filteredResults);
  }, [query]);

  // Handle selection of a search result
  const handleSelect = (result: SearchResult) => {
    navigate(result.route);
    
    toast({
      title: `Navigating to ${result.title}`,
      description: `Opening ${result.type}: ${result.title}`,
    });
    
    onOpenChange(false);
    setQuery('');
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search files, clients, cases, documents..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        
        {searchResults.length > 0 && (
          <>
            {/* Group results by type */}
            {['client', 'attorney', 'case', 'document', 'file', 'deposition', 'billing', 'calendar', 'message'].map(type => {
              const typeResults = searchResults.filter(r => r.type === type);
              if (typeResults.length === 0) return null;
              
              return (
                <React.Fragment key={type}>
                  <CommandGroup heading={`${type.charAt(0).toUpperCase() + type.slice(1)}s`}>
                    {typeResults.map(result => (
                      <CommandItem
                        key={result.id}
                        onSelect={() => handleSelect(result)}
                        className="flex items-center gap-2"
                      >
                        {result.icon}
                        <div>
                          <p>{result.title}</p>
                          {result.subtitle && (
                            <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </React.Fragment>
              );
            })}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandSearch;
