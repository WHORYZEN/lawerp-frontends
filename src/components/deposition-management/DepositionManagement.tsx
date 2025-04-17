
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  Briefcase,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  X,
  FileUp,
  ChevronsUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DepositionList from "./DepositionList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DepositionStatus, DepositionFilterParams } from "@/types/deposition";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { depositionsApi } from "@/lib/api/depositions-api";

const DepositionManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const params = new URLSearchParams(location.search);
  const statusParam = params.get('status') as DepositionStatus | null;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState<string>(statusParam || "all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<DepositionFilterParams>({
    search: "",
    status: undefined,
    clientId: undefined,
    caseId: undefined,
    attorneyId: undefined,
    dateRange: {
      from: undefined,
      to: undefined,
    }
  });

  // Mock data for filters
  const mockClients = [
    { id: "c1", name: "John Doe" },
    { id: "c2", name: "Jane Smith" },
    { id: "c3", name: "Bob Johnson" },
  ];

  const mockCases = [
    { id: "case1", name: "Car Accident - Doe v. Smith" },
    { id: "case2", name: "Slip & Fall - Smith v. Market" },
    { id: "case3", name: "Medical Malpractice - Johnson v. Hospital" },
  ];

  const mockAttorneys = [
    { id: "a1", name: "Sarah McCoy" },
    { id: "a2", name: "Dan Lee" },
    { id: "a3", name: "Jessica Miller" },
  ];

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    if (value === "all") {
      setFilters(prev => ({ ...prev, status: undefined }));
      navigate("/depositions");
    } else {
      setFilters(prev => ({ ...prev, status: value as DepositionStatus }));
      navigate(`/depositions?status=${value}`);
    }
  };

  const handleCreateNew = () => {
    navigate("/depositions/create");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleFilterChange = (field: keyof DepositionFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: searchQuery,
      status: currentTab === "all" ? undefined : currentTab as DepositionStatus,
      clientId: undefined,
      caseId: undefined,
      attorneyId: undefined,
      dateRange: {
        from: undefined,
        to: undefined,
      }
    });
    setFilterOpen(false);
  };

  const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
    setIsExporting(true);
    try {
      const downloadUrl = await depositionsApi.exportDepositions(format);
      
      // Create a temporary anchor element to trigger download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `depositions-export-${format}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `Depositions exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the depositions",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search depositions..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Depositions</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select
                    value={filters.clientId || ""}
                    onValueChange={(value) => handleFilterChange('clientId', value || undefined)}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="All Clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_clients">All Clients</SelectItem>
                      {mockClients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="case">Case</Label>
                  <Select
                    value={filters.caseId || ""}
                    onValueChange={(value) => handleFilterChange('caseId', value || undefined)}
                  >
                    <SelectTrigger id="case">
                      <SelectValue placeholder="All Cases" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_cases">All Cases</SelectItem>
                      {mockCases.map(case_ => (
                        <SelectItem key={case_.id} value={case_.id}>
                          {case_.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="attorney">Attorney</Label>
                  <Select
                    value={filters.attorneyId || ""}
                    onValueChange={(value) => handleFilterChange('attorneyId', value || undefined)}
                  >
                    <SelectTrigger id="attorney">
                      <SelectValue placeholder="All Attorneys" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_attorneys">All Attorneys</SelectItem>
                      {mockAttorneys.map(attorney => (
                        <SelectItem key={attorney.id} value={attorney.id}>
                          {attorney.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {filters.dateRange?.from ? (
                            format(filters.dateRange.from, "PPP")
                          ) : (
                            <span>From date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={filters.dateRange?.from}
                          onSelect={(date) =>
                            handleFilterChange('dateRange', {
                              ...filters.dateRange,
                              from: date
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {filters.dateRange?.to ? (
                            format(filters.dateRange.to, "PPP")
                          ) : (
                            <span>To date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={filters.dateRange?.to}
                          onSelect={(date) =>
                            handleFilterChange('dateRange', {
                              ...filters.dateRange,
                              to: date
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                  <Button size="sm" onClick={() => setFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-1" disabled={isExporting}>
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleExport('csv')}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleExport('json')}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Export as JSON
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleExport('pdf')}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button onClick={handleCreateNew} className="gap-1">
            <Plus className="h-4 w-4" />
            New Deposition
          </Button>
        </div>
      </div>

      <Tabs defaultValue={currentTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rescheduled">Rescheduled</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value={currentTab}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Depositions</CardTitle>
              <CardDescription>
                Manage and organize your client depositions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DepositionList 
                searchQuery={searchQuery}
                statusFilter={currentTab === "all" ? undefined : currentTab as DepositionStatus}
                filters={filters}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepositionManagement;
