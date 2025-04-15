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
import BillsForm from "./BillsForm";
import { useToast } from "@/hooks/use-toast";

// Define the Bill document type
type Bill = {
  id: string;
  client_id: string;
  case_id: string;
  client_name?: string; // For display purposes
  provider_name: string;
  date_of_service: string;
  billed_amount: number;
  covered_amount: number;
  balance_due: number;
  status: "Pending" | "Paid" | "Disputed" | "Approved";
  document_url: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

// Mock data for initial development
const mockBills: Bill[] = [
  {
    id: "1",
    client_id: "c1",
    case_id: "case1",
    client_name: "John Doe", // For display purposes
    provider_name: "City General Hospital",
    date_of_service: "2023-02-10",
    billed_amount: 5000.00,
    covered_amount: 3500.00,
    balance_due: 1500.00,
    status: "Pending",
    document_url: "/documents/bill1.pdf",
    notes: "Initial ER visit",
    created_at: "2023-02-15T14:30:00Z",
    updated_at: "2023-02-15T14:30:00Z",
  },
  {
    id: "2",
    client_id: "c2",
    case_id: "case2",
    client_name: "Jane Smith", // For display purposes
    provider_name: "Westside Medical Center",
    date_of_service: "2023-03-05",
    billed_amount: 2500.00,
    covered_amount: 1000.00,
    balance_due: 1500.00,
    status: "Disputed",
    document_url: "/documents/bill2.pdf",
    notes: "X-ray and physical therapy",
    created_at: "2023-03-10T10:15:00Z",
    updated_at: "2023-03-10T10:15:00Z",
  },
];

const BillsSheet = () => {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const { toast } = useToast();

  // Filter bills based on search term
  const filteredBills = bills.filter(
    (bill) =>
      bill.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBill = (bill: Omit<Bill, "id" | "created_at" | "updated_at">) => {
    const newBill: Bill = {
      id: Math.random().toString(36).substr(2, 9),
      ...bill,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setBills([...bills, newBill]);
    setIsFormOpen(false);
    toast({
      title: "Bill added",
      description: "The medical bill has been added successfully.",
    });
  };

  const handleEditBill = (bill: Bill) => {
    setBills(
      bills.map((b) => (b.id === bill.id ? { ...bill, updated_at: new Date().toISOString() } : b))
    );
    setEditingBill(null);
    setIsFormOpen(false);
    toast({
      title: "Bill updated",
      description: "The medical bill has been updated successfully.",
    });
  };

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id));
    toast({
      title: "Bill deleted",
      description: "The medical bill has been deleted successfully.",
    });
  };

  const handleDownload = (id: string) => {
    // In a real application, this would trigger an API call
    toast({
      title: "Downloading bill",
      description: "Your bill document will be downloaded shortly.",
    });
  };

  const getStatusBadgeColor = (status: Bill["status"]) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Paid":
        return "default";
      case "Disputed":
        return "destructive";
      case "Approved":
        return "default";
      default:
        return "secondary";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {isFormOpen ? (
        <BillsForm
          onSubmit={editingBill ? handleEditBill : handleAddBill}
          initialData={editingBill}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingBill(null);
          }}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
                prefix={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Add Medical Bill
            </Button>
          </div>

          {filteredBills.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-2 text-sm font-medium">No Medical Bills</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "No bills match your search criteria." : "Get started by adding a new medical bill."}
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Date of Service</TableHead>
                    <TableHead>Billed Amount</TableHead>
                    <TableHead>Balance Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.client_name}</TableCell>
                      <TableCell>{bill.provider_name}</TableCell>
                      <TableCell>{new Date(bill.date_of_service).toLocaleDateString()}</TableCell>
                      <TableCell>{formatCurrency(bill.billed_amount)}</TableCell>
                      <TableCell>{formatCurrency(bill.balance_due)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeColor(bill.status)}>
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(bill.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingBill(bill);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBill(bill.id)}
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

export default BillsSheet;
