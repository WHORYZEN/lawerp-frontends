
import { useState, useMemo } from "react";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Search, Filter, FileText, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the dependency record type
type DependencyRecord = {
  record_id: string;
  type: "LOP" | "LOR" | "Insurance" | "Bill";
  client_id: string;
  client_name: string;
  case_number: string;
  provider_name: string;
  document_title: string;
  status: string;
  amount?: number;
  date_of_service: string;
  document_url: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  notes?: string;
};

// Mock data for initial development
const mockDependencyRecords: DependencyRecord[] = [
  {
    record_id: "lop1",
    type: "LOP",
    client_id: "c1",
    client_name: "John Doe",
    case_number: "CASE-2023-001",
    provider_name: "City General Hospital",
    document_title: "Letter of Protection - City General",
    status: "Signed",
    date_of_service: "2023-03-15",
    document_url: "/documents/lop1.pdf",
    uploaded_by: "Sarah Admin",
    created_at: "2023-03-15T14:30:00Z",
    updated_at: "2023-03-15T14:30:00Z",
    notes: "Patient requires ongoing treatment"
  },
  {
    record_id: "ins1",
    type: "Insurance",
    client_id: "c1",
    client_name: "John Doe",
    case_number: "CASE-2023-001",
    provider_name: "BlueCross BlueShield",
    document_title: "Insurance Policy BC-12345-XYZ",
    status: "Approved",
    date_of_service: "2023-02-15",
    document_url: "/documents/insurance1.pdf",
    uploaded_by: "Mark Handler",
    created_at: "2023-02-15T10:30:00Z",
    updated_at: "2023-02-15T10:30:00Z",
    notes: "Full coverage policy"
  },
  {
    record_id: "bill1",
    type: "Bill",
    client_id: "c1",
    client_name: "John Doe",
    case_number: "CASE-2023-001",
    provider_name: "City General Hospital",
    document_title: "ER Visit Bill",
    status: "Pending",
    amount: 5000.00,
    date_of_service: "2023-02-10",
    document_url: "/documents/bill1.pdf",
    uploaded_by: "Sarah Admin",
    created_at: "2023-02-15T14:30:00Z",
    updated_at: "2023-02-15T14:30:00Z",
    notes: "Initial ER visit"
  },
  {
    record_id: "lor1",
    type: "LOR",
    client_id: "c2",
    client_name: "Jane Smith",
    case_number: "CASE-2023-002",
    provider_name: "Dr. Robert Chen",
    document_title: "Referral to Orthopedic Specialist",
    status: "Sent",
    date_of_service: "2023-04-05",
    document_url: "/documents/lor1.pdf",
    uploaded_by: "Mark Handler",
    created_at: "2023-04-05T09:15:00Z",
    updated_at: "2023-04-05T09:15:00Z",
    notes: "Patient needs specialized treatment"
  },
];

const DependencyViewSheet = () => {
  const [records, setRecords] = useState<DependencyRecord[]>(mockDependencyRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [clientFilter, setClientFilter] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<DependencyRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const { toast } = useToast();

  // Get unique clients for filter dropdown
  const uniqueClients = useMemo(() => {
    const clients = records.map(record => ({ 
      id: record.client_id, 
      name: record.client_name 
    }));
    
    return Array.from(new Map(clients.map(client => 
      [client.id, client])).values());
  }, [records]);

  // Filter records based on search term and filters
  const filteredRecords = useMemo(() => {
    return records.filter(
      (record) => {
        const matchesSearch = 
          record.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.case_number.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesTypeFilter = !typeFilter || record.type === typeFilter;
        const matchesClientFilter = !clientFilter || record.client_id === clientFilter;
        
        return matchesSearch && matchesTypeFilter && matchesClientFilter;
      }
    );
  }, [records, searchTerm, typeFilter, clientFilter]);

  const handleDownload = (id: string) => {
    // In a real application, this would trigger an API call
    toast({
      title: "Downloading document",
      description: "Your document will be downloaded shortly.",
    });
  };

  const handleViewRecord = (record: DependencyRecord) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "-";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadgeColor = (status: string, type: string) => {
    if (status.includes("Approved")) return "default";
    if (status.includes("Pending")) return "secondary";
    if (status.includes("Signed") || status.includes("Sent")) return "default";
    if (status.includes("Rejected") || status.includes("Disputed")) return "destructive";
    return "secondary";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "LOP":
        return "bg-blue-100 text-blue-800";
      case "LOR":
        return "bg-green-100 text-green-800";
      case "Insurance":
        return "bg-purple-100 text-purple-800";
      case "Bill":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-60"
            prefix={<Search className="h-4 w-4 text-gray-400" />}
          />
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="LOP">LOP</SelectItem>
                <SelectItem value="LOR">LOR</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Bill">Bill</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Clients</SelectItem>
                {uniqueClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="h-12 w-12 mx-auto text-gray-300" />
          <h3 className="mt-2 text-sm font-medium">No Documents Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || typeFilter || clientFilter ? 
              "No documents match your search criteria." : 
              "There are no documents in the system yet."}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Case #</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Document Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.record_id}>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                      {record.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{record.client_name}</TableCell>
                  <TableCell>{record.case_number}</TableCell>
                  <TableCell>{record.provider_name}</TableCell>
                  <TableCell>{record.document_title}</TableCell>
                  <TableCell>{formatDate(record.date_of_service)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeColor(record.status, record.type)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRecord(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(record.record_id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Record Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRecord?.document_title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Document Type</h4>
                  <p className="mt-1">{selectedRecord.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="mt-1">
                    <Badge variant={getStatusBadgeColor(selectedRecord.status, selectedRecord.type)}>
                      {selectedRecord.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Client</h4>
                  <p className="mt-1">{selectedRecord.client_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Case Number</h4>
                  <p className="mt-1">{selectedRecord.case_number}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Provider</h4>
                  <p className="mt-1">{selectedRecord.provider_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date of Service</h4>
                  <p className="mt-1">{formatDate(selectedRecord.date_of_service)}</p>
                </div>
                {selectedRecord.amount !== undefined && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                    <p className="mt-1">{formatCurrency(selectedRecord.amount)}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created By</h4>
                  <p className="mt-1">{selectedRecord.uploaded_by}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                  <p className="mt-1">{selectedRecord.notes || "No notes available."}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-end">
                  <Button onClick={() => handleDownload(selectedRecord.record_id)} className="mr-2">
                    <Download className="h-4 w-4 mr-2" /> Download Document
                  </Button>
                  <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DependencyViewSheet;
