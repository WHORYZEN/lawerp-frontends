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
  Briefcase,
  Loader2
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Deposition, DepositionStatus, DepositionFilterParams } from "@/types/deposition";
import { depositionsApi } from "@/lib/api/depositions-api";
import { useToast } from "@/components/ui/use-toast";

interface DepositionListProps {
  searchQuery: string;
  statusFilter?: DepositionStatus;
  filters?: DepositionFilterParams;
}

const DepositionList: React.FC<DepositionListProps> = ({ 
  searchQuery, 
  statusFilter,
  filters 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [depositions, setDepositions] = useState<Deposition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadDepositions();
  }, [searchQuery, statusFilter, filters]);

  const loadDepositions = async () => {
    setIsLoading(true);
    try {
      let data;
      
      if (filters) {
        data = await depositionsApi.filterDepositions({
          search: filters.search || searchQuery,
          status: filters.status || statusFilter,
          clientId: filters.clientId,
          caseId: filters.caseId,
          attorneyId: filters.attorneyId,
          dateRange: filters.dateRange
        });
      } else {
        data = await depositionsApi.getDepositions();
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          data = data.filter(depo => 
            depo.title.toLowerCase().includes(query) ||
            depo.attorneyName?.toLowerCase().includes(query) ||
            depo.location?.toLowerCase().includes(query)
          );
        }
        
        if (statusFilter) {
          data = data.filter(depo => depo.status === statusFilter);
        }
      }
      
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
      
      setDepositions(paginatedData);
    } catch (error) {
      console.error("Error loading depositions:", error);
      toast({
        title: "Error",
        description: "Failed to load depositions",
        variant: "destructive",
      });
      setDepositions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id: string) => {
    navigate(`/depositions/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/depositions/edit/${id}`);
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    
    try {
      const success = await depositionsApi.deleteDeposition(deleteConfirmId);
      if (success) {
        setDepositions(prev => prev.filter(depo => depo.id !== deleteConfirmId));
        toast({
          title: "Success",
          description: "Deposition deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete deposition",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting deposition:", error);
      toast({
        title: "Error",
        description: "Failed to delete deposition",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadDepositions();
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        
        <div className="space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
        <>
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
                          onClick={() => confirmDelete(deposition.id)}
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
          
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
      
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the deposition and remove it from the system.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepositionList;
