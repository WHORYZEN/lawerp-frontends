
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Briefcase, 
  FileText,
  Edit,
  Trash,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  XCircle,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Deposition, DepositionStatus } from "@/types/deposition";
import { depositionsApi } from "@/lib/api/depositions-api";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const DepositionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deposition, setDeposition] = useState<Deposition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Mock data for client, case and attorney names
  const getClientName = (clientId: string) => {
    const mockClients = [
      { id: "c1", name: "John Doe" },
      { id: "c2", name: "Jane Smith" },
      { id: "c3", name: "Bob Johnson" },
    ];
    return mockClients.find(client => client.id === clientId)?.name || "Unknown Client";
  };
  
  const getCaseName = (caseId: string) => {
    const mockCases = [
      { id: "case1", name: "Car Accident - Doe v. Smith" },
      { id: "case2", name: "Slip & Fall - Smith v. Market" },
      { id: "case3", name: "Medical Malpractice - Johnson v. Hospital" },
    ];
    return mockCases.find(case_ => case_.id === caseId)?.name || "Unknown Case";
  };

  // Load deposition data
  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    depositionsApi.getDeposition(id)
      .then(data => {
        if (data) {
          setDeposition(data);
        } else {
          toast({
            title: "Not Found",
            description: "The requested deposition could not be found",
            variant: "destructive",
          });
          navigate("/depositions");
        }
      })
      .catch(error => {
        console.error("Error loading deposition:", error);
        toast({
          title: "Error",
          description: "Failed to load deposition details",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, navigate, toast]);

  // Handle edit button click
  const handleEdit = () => {
    navigate(`/depositions/edit/${id}`);
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const success = await depositionsApi.deleteDeposition(id);
      if (success) {
        toast({
          title: "Success",
          description: "Deposition deleted successfully",
        });
        navigate("/depositions");
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
        description: "An error occurred while deleting the deposition",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: DepositionStatus) => {
    switch(status) {
      case "scheduled":
        return <Badge className="bg-blue-500"><Calendar className="w-3 h-3 mr-1" /> Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      case "rescheduled":
        return <Badge className="bg-amber-500"><RefreshCw className="w-3 h-3 mr-1" /> Rescheduled</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
      default:
        return <Badge><Calendar className="w-3 h-3 mr-1" /> {status}</Badge>;
    }
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" className="mb-2 w-24" asChild>
            <Skeleton className="h-8 w-24" />
          </Button>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Render not found
  if (!deposition) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Deposition Not Found</CardTitle>
          <CardDescription>
            The requested deposition could not be found
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            The deposition you are looking for may have been deleted or does not exist.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate("/depositions")} className="mx-auto">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Depositions
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="mb-2" onClick={() => navigate("/depositions")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Depositions
          </Button>
          <div>{getStatusBadge(deposition.status)}</div>
        </div>
        <CardTitle className="text-2xl">{deposition.title}</CardTitle>
        <CardDescription>
          {deposition.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium mr-2">Date:</span>
              {format(parseISO(deposition.date), "PPP")}
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium mr-2">Time:</span>
              {format(parseISO(deposition.date), "p")}
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium mr-2">Location:</span>
              {deposition.location || "Not specified"}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium mr-2">Client:</span>
              {getClientName(deposition.clientId)}
            </div>
            <div className="flex items-center text-sm">
              <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium mr-2">Case:</span>
              {getCaseName(deposition.caseId)}
            </div>
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium mr-2">Attorney:</span>
              {deposition.attorneyName || "Not assigned"}
            </div>
          </div>
        </div>
        
        {deposition.notes && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {deposition.notes}
            </p>
          </div>
        )}
        
        {deposition.documentLink && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Documents</h3>
            <Button variant="outline" size="sm" asChild>
              <a href={deposition.documentLink} target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                View Document
              </a>
            </Button>
          </div>
        )}
        
        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p>Created: {format(parseISO(deposition.createdAt), "PPP")}</p>
          <p>Last Updated: {format(parseISO(deposition.updatedAt), "PPP")}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Deposition
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              <Trash className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Deposition"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Deposition</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this deposition? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default DepositionDetail;
