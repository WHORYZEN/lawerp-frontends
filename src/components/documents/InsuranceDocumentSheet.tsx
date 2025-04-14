
import { useState } from "react";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download, Pencil, Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import InsuranceDocumentForm from "./InsuranceDocumentForm";
import { useToast } from "@/hooks/use-toast";

// Mock data for initial development
const mockInsuranceDocuments = [
  {
    id: "1",
    client_id: "c1",
    case_id: "case1",
    client_name: "John Doe", // For display purposes
    insurance_company: "BlueCross BlueShield",
    policy_number: "BC-12345-XYZ",
    date_received: "2023-02-15",
    status: "Approved",
    document_url: "/documents/insurance1.pdf",
    notes: "Full coverage policy",
    created_at: "2023-02-15T14:30:00Z",
    updated_at: "2023-02-15T14:30:00Z",
  },
  {
    id: "2",
    client_id: "c2",
    case_id: "case2",
    client_name: "Jane Smith", // For display purposes
    insurance_company: "Aetna",
    policy_number: "AET-678910-ABC",
    date_received: "2023-03-10",
    status: "Pending",
    document_url: "/documents/insurance2.pdf",
    notes: "Missing some information",
    created_at: "2023-03-10T10:15:00Z",
    updated_at: "2023-03-10T10:15:00Z",
  },
];

// Define the Insurance document type
type InsuranceDocument = {
  id: string;
  client_id: string;
  case_id: string;
  client_name?: string; // For display purposes
  insurance_company: string;
  policy_number: string;
  date_received: string;
  status: "Received" | "Pending" | "Rejected" | "Approved";
  document_url: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

const InsuranceDocumentSheet = () => {
  const [documents, setDocuments] = useState<InsuranceDocument[]>(mockInsuranceDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<InsuranceDocument | null>(null);
  const { toast } = useToast();

  // Filter documents based on search term
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.insurance_company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.policy_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDocument = (document: Omit<InsuranceDocument, "id" | "created_at" | "updated_at">) => {
    const newDocument: InsuranceDocument = {
      id: Math.random().toString(36).substr(2, 9),
      ...document,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setDocuments([...documents, newDocument]);
    setIsFormOpen(false);
    toast({
      title: "Document added",
      description: "The insurance document has been added successfully.",
    });
  };

  const handleEditDocument = (document: InsuranceDocument) => {
    setDocuments(
      documents.map((doc) => (doc.id === document.id ? { ...document, updated_at: new Date().toISOString() } : doc))
    );
    setEditingDocument(null);
    setIsFormOpen(false);
    toast({
      title: "Document updated",
      description: "The insurance document has been updated successfully.",
    });
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The insurance document has been deleted successfully.",
    });
  };

  const handleDownload = (id: string) => {
    // In a real application, this would trigger an API call
    toast({
      title: "Downloading document",
      description: "Your document will be downloaded shortly.",
    });
  };

  const getStatusBadgeColor = (status: InsuranceDocument["status"]) => {
    switch (status) {
      case "Received":
        return "secondary";
      case "Pending":
        return "secondary";
      case "Approved":
        return "default";
      case "Rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      {isFormOpen ? (
        <InsuranceDocumentForm
          onSubmit={editingDocument ? handleEditDocument : handleAddDocument}
          initialData={editingDocument}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingDocument(null);
          }}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
                prefix={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Add Insurance Document
            </Button>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-2 text-sm font-medium">No Insurance Documents</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "No documents match your search criteria." : "Get started by adding a new insurance document."}
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Insurance Company</TableHead>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Date Received</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.client_name}</TableCell>
                      <TableCell>{document.insurance_company}</TableCell>
                      <TableCell>{document.policy_number}</TableCell>
                      <TableCell>{new Date(document.date_received).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeColor(document.status)}>
                          {document.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(document.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingDocument(document);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDocument(document.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InsuranceDocumentSheet;
