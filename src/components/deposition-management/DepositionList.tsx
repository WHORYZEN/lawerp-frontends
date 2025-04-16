
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye,
  Pencil,
  Trash2,
  FileDown,
  Calendar,
  Clock,
  MapPin,
  User,
  Briefcase 
} from "lucide-react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Deposition, DepositionStatus } from "@/types/deposition";

interface DepositionListProps {
  searchQuery: string;
  statusFilter?: DepositionStatus;
}

// Mock data - in a real app this would come from an API
const MOCK_DEPOSITIONS: Deposition[] = [
  {
    id: "1",
    clientId: "c1",
    caseId: "case1",
    attorneyId: "a1",
    attorneyName: "Sarah McCoy",
    title: "Car Crash Case Deposition",
    description: "Deposition for the witness in the car crash case",
    date: "2025-04-21T10:00:00",
    location: "Downtown Office, Conference Room A",
    status: "scheduled",
    notes: "Prepare questions about traffic light timing",
    createdAt: "2023-03-10T08:00:00",
    updatedAt: "2023-03-10T08:00:00"
  },
  {
    id: "2",
    clientId: "c2",
    caseId: "case2",
    attorneyId: "a2",
    attorneyName: "Dan Lee",
    title: "Slip & Fall Review",
    description: "Deposition of store manager regarding safety protocols",
    date: "2025-04-10T14:30:00",
    location: "Main Office, Room 302",
    status: "completed",
    notes: "Follow up on maintenance records",
    documentLink: "/documents/depo-2.pdf",
    createdAt: "2023-03-05T09:00:00",
    updatedAt: "2023-04-10T15:45:00"
  },
  {
    id: "3",
    clientId: "c3",
    caseId: "case3",
    attorneyId: "a3",
    attorneyName: "Jessica Miller",
    title: "Medical Malpractice Expert",
    description: "Expert witness deposition for medical standards",
    date: "2025-05-15T09:00:00",
    location: "Video Conference",
    status: "scheduled",
    notes: "Review medical charts before deposition",
    createdAt: "2023-04-01T10:30:00",
    updatedAt: "2023-04-01T10:30:00"
  },
  {
    id: "4",
    clientId: "c1",
    caseId: "case1",
    attorneyId: "a1",
    attorneyName: "Sarah McCoy",
    title: "Insurance Adjuster Testimony",
    description: "Deposition of insurance company representative",
    date: "2025-03-30T13:00:00",
    location: "Insurance Company HQ",
    status: "cancelled",
    notes: "Rescheduling needed due to scheduling conflict",
    createdAt: "2023-02-20T11:15:00",
    updatedAt: "2023-03-25T09:30:00"
  }
];

const DepositionList: React.FC<DepositionListProps> = ({ searchQuery, statusFilter }) => {
  const navigate = useNavigate();
  const [depositions, setDepositions] = useState<Deposition[]>([]);

  useEffect(() => {
    // Filter depositions based on search query and status
    let filtered = [...MOCK_DEPOSITIONS];
    
    if (statusFilter) {
      filtered = filtered.filter(depo => depo.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(depo => 
        depo.title.toLowerCase().includes(query) ||
        depo.attorneyName?.toLowerCase().includes(query) ||
        depo.location?.toLowerCase().includes(query)
      );
    }
    
    setDepositions(filtered);
  }, [searchQuery, statusFilter]);

  const handleView = (id: string) => {
    navigate(`/depositions/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/depositions/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    // In a real app, this would call an API
    if (confirm("Are you sure you want to delete this deposition?")) {
      setDepositions(depositions.filter(depo => depo.id !== id));
    }
  };

  const getStatusBadge = (status: DepositionStatus) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "rescheduled":
        return <Badge className="bg-amber-500">Rescheduled</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      {depositions.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No depositions found. {!statusFilter && searchQuery === "" && (
            <Button 
              variant="link" 
              onClick={() => navigate("/depositions/create")}
              className="px-1 py-0 h-auto"
            >
              Create your first deposition
            </Button>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Attorney</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {depositions.map((deposition) => (
              <TableRow key={deposition.id}>
                <TableCell className="font-medium">{deposition.title}</TableCell>
                <TableCell>
                  {format(new Date(deposition.date), "MMM d, yyyy")}
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(deposition.date), "h:mm a")}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {deposition.location || "N/A"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {deposition.attorneyName || "Unassigned"}
                </TableCell>
                <TableCell>{getStatusBadge(deposition.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(deposition.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(deposition.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {deposition.documentLink && (
                        <DropdownMenuItem>
                          <FileDown className="mr-2 h-4 w-4" />
                          Download Document
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDelete(deposition.id)}
                      >
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
      )}
    </div>
  );
};

export default DepositionList;
