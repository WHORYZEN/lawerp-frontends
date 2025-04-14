
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Sample data
const initialData = [
  {
    id: "CR-2023-001",
    name: "James Peterson",
    dob: "04/12/1985",
    doj: "11/05/2022",
    provider: "Memorial Hospital",
    lopStatus: "Signed",
  },
  {
    id: "CR-2023-002",
    name: "Maria Rodriguez",
    dob: "08/27/1990",
    doj: "12/14/2022",
    provider: "City Medical Center",
    lopStatus: "Pending",
  },
  {
    id: "CR-2023-003",
    name: "Robert Johnson",
    dob: "01/15/1978",
    doj: "02/23/2023",
    provider: "Regional Healthcare",
    lopStatus: "Signed",
  },
  {
    id: "CR-2023-004",
    name: "Sarah Williams",
    dob: "06/30/1982",
    doj: "03/10/2023",
    provider: "University Hospital",
    lopStatus: "Pending",
  },
  {
    id: "CR-2023-005",
    name: "David Miller",
    dob: "11/22/1975",
    doj: "05/18/2023",
    provider: "St. Mary's Medical",
    lopStatus: "Signed",
  },
  {
    id: "CR-2023-006",
    name: "Jennifer Brown",
    dob: "03/04/1993",
    doj: "07/29/2023",
    provider: "Valley Health Group",
    lopStatus: "Not Sent",
  },
];

const BillingTable = () => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filters, setFilters] = useState({
    provider: "",
    dateFrom: "",
    dateTo: "",
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Apply all filters
  const filteredData = data.filter((client) => {
    // Search filter
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    // LOP Status filter
    const matchesStatus = 
      filterStatus === "all" || 
      client.lopStatus.toLowerCase() === filterStatus.toLowerCase();
      
    // Provider filter
    const matchesProvider = 
      !filters.provider || 
      client.provider.toLowerCase().includes(filters.provider.toLowerCase());
      
    // Date filters - convert string dates to Date objects for comparison
    const clientDojParts = client.doj.split('/');
    const clientDate = new Date(
      parseInt(`20${clientDojParts[2]}`), // Year (adding "20" prefix for "23" to become "2023")
      parseInt(clientDojParts[0]) - 1, // Month (0-indexed in JS Date)
      parseInt(clientDojParts[1]) // Day
    );
    
    // From date filter
    let matchesFromDate = true;
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      matchesFromDate = clientDate >= fromDate;
    }
    
    // To date filter
    let matchesToDate = true;
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      matchesToDate = clientDate <= toDate;
    }
    
    return matchesSearch && matchesStatus && matchesProvider && matchesFromDate && matchesToDate;
  });
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Apply filters and update active filters list
  const applyFilters = () => {
    const newActiveFilters = [];
    
    if (filters.provider) {
      newActiveFilters.push(`Provider: ${filters.provider}`);
    }
    
    if (filters.dateFrom) {
      newActiveFilters.push(`From: ${new Date(filters.dateFrom).toLocaleDateString()}`);
    }
    
    if (filters.dateTo) {
      newActiveFilters.push(`To: ${new Date(filters.dateTo).toLocaleDateString()}`);
    }
    
    setActiveFilters(newActiveFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      provider: "",
      dateFrom: "",
      dateTo: "",
    });
    setActiveFilters([]);
  };
  
  // Remove a specific filter
  const removeFilter = (index: number) => {
    const newActiveFilters = [...activeFilters];
    newActiveFilters.splice(index, 1);
    setActiveFilters(newActiveFilters);
    
    // Reset the corresponding filter value
    const filterType = activeFilters[index].split(':')[0].trim();
    
    if (filterType === 'Provider') {
      setFilters(prev => ({ ...prev, provider: "" }));
    } else if (filterType === 'From') {
      setFilters(prev => ({ ...prev, dateFrom: "" }));
    } else if (filterType === 'To') {
      setFilters(prev => ({ ...prev, dateTo: "" }));
    }
  };

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:max-w-xs relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search client name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="LOP Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="signed">Signed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="not sent">Not Sent</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Advanced Filters</h4>
                  <p className="text-sm text-muted-foreground">
                    Filter clients by additional criteria
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="provider" className="text-right">
                      Provider
                    </Label>
                    <Input
                      id="provider"
                      value={filters.provider}
                      onChange={(e) => setFilters({ ...filters, provider: e.target.value })}
                      className="col-span-2"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="dateFrom" className="text-right">
                      Date From
                    </Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="col-span-2"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="dateTo" className="text-right">
                      Date To
                    </Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="col-span-2"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="outline">Export</Button>
        </div>
      </div>
      
      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="flex gap-1 items-center">
              {filter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter(index)} 
              />
            </Badge>
          ))}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-lawfirm-gray bg-opacity-50">
            <TableRow>
              <TableHead className="font-medium">Client Name</TableHead>
              <TableHead className="font-medium">ID / Case Number</TableHead>
              <TableHead className="font-medium">DOB</TableHead>
              <TableHead className="font-medium">DOJ</TableHead>
              <TableHead className="font-medium">Provider</TableHead>
              <TableHead className="font-medium">LOP Status</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.dob}</TableCell>
                  <TableCell>{client.doj}</TableCell>
                  <TableCell>{client.provider}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        client.lopStatus === "Signed"
                          ? "bg-green-100 text-green-800"
                          : client.lopStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      )}
                    >
                      {client.lopStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-4 py-2 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default BillingTable;
