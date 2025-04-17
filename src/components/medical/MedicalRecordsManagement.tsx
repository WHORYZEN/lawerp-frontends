import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MedicalRecord {
  id: string;
  patientName: string;
  recordType: string;
  date: string;
  provider: string;
  status: 'active' | 'inactive';
}

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "1",
    patientName: "John Doe",
    recordType: "Consultation",
    date: "2023-01-15",
    provider: "Dr. Smith",
    status: "active",
  },
  {
    id: "2",
    patientName: "Jane Smith",
    recordType: "Lab Results",
    date: "2023-02-20",
    provider: "Dr. Johnson",
    status: "inactive",
  },
  {
    id: "3",
    patientName: "Robert Jones",
    recordType: "Prescription",
    date: "2023-03-10",
    provider: "Dr. Williams",
    status: "active",
  },
];

const MedicalRecordsManagement: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Medical Records</h2>
        <Input placeholder="Search records..." className="max-w-md" />
      </div>

      <div className="border rounded-md">
        <ScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Record Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMedicalRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.patientName}</TableCell>
                  <TableCell>{record.recordType}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.provider}</TableCell>
                  <TableCell>
                    {record.status === 'active' ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MedicalRecordsManagement;
