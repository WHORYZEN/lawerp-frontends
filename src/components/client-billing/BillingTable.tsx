
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
import { Search } from "lucide-react";

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
  
  // Filter data based on search term and status
  const filteredData = data.filter(
    (client) =>
      (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || client.lopStatus.toLowerCase() === filterStatus.toLowerCase())
  );
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

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
          <Button variant="outline">Export</Button>
        </div>
      </div>
      
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
