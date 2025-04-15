import React from 'react';
import { useState } from "react";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download, Pencil, Trash2, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import LopDocumentForm from "./LopDocumentForm";
import { useToast } from "@/hooks/use-toast";

// Define the LOP document type
type LopDocument = {
  id: string;
  client_id: string;
  case_id: string;
  client_name?: string; // For display purposes
  provider_name: string;
  date_issued: string;
  physician_name: string;
  status: "Draft" | "Signed" | "Sent" | "Approved";
  notes: string;
  document_url: string;
  created_at: string;
  updated_at: string;
};

// Mock data for initial development
const mockLopDocuments: LopDocument[] = [
  {
    id: "1",
    client_id: "c1",
    case_id: "case1",
    client_name: "John Doe", // For display purposes
    provider_name: "City General Hospital",
    date_issued: "2023-03-15",
    physician_name: "Dr. Sarah Johnson",
    status: "Signed",
    notes: "Patient requires ongoing treatment",
    document_url: "/documents/lop1.pdf",
    created_at: "2023-03-15T14:30:00Z",
    updated_at: "2023-03-15T14:30:00Z",
  },
  {
    id: "2",
    client_id: "c2",
    case_id: "case2",
    client_name: "Jane Smith", // For display purposes
    provider_name: "Westside Medical Center",
    date_issued: "2023-04-20",
    physician_name: "Dr. Robert Chen",
    status: "Draft",
    notes: "Pending approval from insurance",
    document_url: "/documents/lop2.pdf",
    created_at: "2023-04-20T10:15:00Z",
    updated_at: "2023-04-20T10:15:00Z",
  },
];

const LopDocumentSheet = () => {
  const [documents, setDocuments] = useState<LopDocument[]>(mockLopDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<LopDocument | null>(null);
  const { toast } = useToast();

  // Filter documents based on search term
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.physician_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDocument = (document: Omit<LopDocument, "id" | "created_at" | "updated_at">) => {
    const newDocument: LopDocument = {
      id: Math.random().toString(36).substr(2, 9),
      ...document,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setDocuments([...documents, newDocument]);
    setIsFormOpen(false);
    toast({
      title: "Document added",
      description: "The LOP document has been added successfully.",
    });
  };

  const handleEditDocument = (document: LopDocument) => {
    setDocuments(
      documents.map((doc) => (doc.id === document.id ? { ...document, updated_at: new Date().toISOString() } : doc))
    );
    setEditingDocument(null);
    setIsFormOpen(false);
    toast({
      title: "Document updated",
      description: "The LOP document has been updated successfully.",
    });
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The LOP document has been deleted successfully.",
    });
  };

  const handleDownload = (id: string) => {
    // In a real application, this would trigger an API call
    toast({
      title: "Downloading document",
      description: "Your document will be downloaded shortly.",
    });
  };

  const getStatusBadgeColor = (status: LopDocument["status"]) => {
    switch (status) {
      case "Draft":
        return "secondary";
      case "Signed":
        return "default";
      case "Sent":
        return "default";
      case "Approved":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      {isFormOpen ? (
        <LopDocumentForm
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
              <Plus className="h-4 w-4 mr-2" /> Add LOP Document
            </Button>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-2 text-sm font-medium">No LOP Documents</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "No documents match your search criteria." : "Get started by adding a new LOP document."}
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Physician</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.client_name}</TableCell>
                      <TableCell>{document.provider_name}</TableCell>
                      <TableCell>{document.physician_name}</TableCell>
                      <TableCell>{new Date(document.date_issued).toLocaleDateString()}</TableCell>
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

export default LopDocumentSheet;
