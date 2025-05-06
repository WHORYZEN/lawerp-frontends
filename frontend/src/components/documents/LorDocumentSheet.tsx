import React from 'react';
import { useState } from "react";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download, Pencil, Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import LorDocumentForm from "./LorDocumentForm";
import { useToast } from "@/hooks/use-toast";

// Define the LOR document type
type LorDocument = {
  id: string;
  client_id: string;
  case_id: string;
  client_name?: string; // For display purposes
  referred_to: string;
  referral_reason: string;
  date_issued: string;
  physician_name: string;
  status: "Draft" | "Sent" | "Acknowledged";
  document_url: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

// Mock data for initial development
const mockLorDocuments: LorDocument[] = [
  {
    id: "1",
    client_id: "c1",
    case_id: "case1",
    client_name: "John Doe", // For display purposes
    referred_to: "Orthopedic Specialists Inc.",
    referral_reason: "Persistent back pain after accident",
    date_issued: "2023-03-20",
    physician_name: "Dr. Sarah Johnson",
    status: "Sent",
    document_url: "/documents/lor1.pdf",
    notes: "Patient needs specialized evaluation",
    created_at: "2023-03-20T14:30:00Z",
    updated_at: "2023-03-20T14:30:00Z",
  },
  {
    id: "2",
    client_id: "c2",
    case_id: "case2",
    client_name: "Jane Smith", // For display purposes
    referred_to: "Neurological Institute",
    referral_reason: "Headaches following MVA",
    date_issued: "2023-04-05",
    physician_name: "Dr. Robert Chen",
    status: "Draft",
    document_url: "/documents/lor2.pdf",
    notes: "Pending approval from insurance",
    created_at: "2023-04-05T10:15:00Z",
    updated_at: "2023-04-05T10:15:00Z",
  },
];

const LorDocumentSheet = () => {
  const [documents, setDocuments] = useState<LorDocument[]>(mockLorDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<LorDocument | null>(null);
  const { toast } = useToast();

  // Filter documents based on search term
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.referred_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.physician_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDocument = (document: Omit<LorDocument, "id" | "created_at" | "updated_at">) => {
    const newDocument: LorDocument = {
      id: Math.random().toString(36).substr(2, 9),
      ...document,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setDocuments([...documents, newDocument]);
    setIsFormOpen(false);
    toast({
      title: "Document added",
      description: "The LOR document has been added successfully.",
    });
  };

  const handleEditDocument = (document: LorDocument) => {
    setDocuments(
      documents.map((doc) => (doc.id === document.id ? { ...document, updated_at: new Date().toISOString() } : doc))
    );
    setEditingDocument(null);
    setIsFormOpen(false);
    toast({
      title: "Document updated",
      description: "The LOR document has been updated successfully.",
    });
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The LOR document has been deleted successfully.",
    });
  };

  const handleDownload = (id: string) => {
    // In a real application, this would trigger an API call
    toast({
      title: "Downloading document",
      description: "Your document will be downloaded shortly.",
    });
  };

  const getStatusBadgeColor = (status: LorDocument["status"]) => {
    switch (status) {
      case "Draft":
        return "secondary";
      case "Sent":
        return "default";
      case "Acknowledged":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      {isFormOpen ? (
        <LorDocumentForm
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
              />
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Add LOR Document
            </Button>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-2 text-sm font-medium">No LOR Documents</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "No documents match your search criteria." : "Get started by adding a new LOR document."}
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Referred To</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.client_name}</TableCell>
                      <TableCell>{document.referred_to}</TableCell>
                      <TableCell>{document.referral_reason}</TableCell>
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

export default LorDocumentSheet;
