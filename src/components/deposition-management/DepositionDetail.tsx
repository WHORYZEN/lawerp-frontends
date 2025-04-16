
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Briefcase, 
  FileText,
  Edit,
  Trash2,
  ArrowLeft,
  Download
} from "lucide-react";
import { Deposition } from "@/types/deposition";
import { depositionsApi } from "@/lib/api/depositions-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { useToast } from "@/components/ui/use-toast";

const DepositionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deposition, setDeposition] = useState<Deposition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/depositions");
      return;
    }

    setIsLoading(true);
    depositionsApi.getDeposition(id)
      .then((data) => {
        if (data) {
          setDeposition(data);
        } else {
          toast({
            title: "Error",
            description: "Deposition not found",
            variant: "destructive",
          });
          navigate("/depositions");
        }
      })
      .catch((error) => {
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
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    
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
        description: "Failed to delete deposition",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!deposition) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Deposition not found</h2>
        <Button
          variant="link"
          onClick={() => navigate("/depositions")}
          className="mt-2"
        >
          Return to Depositions
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/depositions")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Depositions
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{deposition.title}</h1>
            <div className="flex items-center mt-2 space-x-2">
              {getStatusBadge(deposition.status)}
              <span className="text-sm text-muted-foreground">
                Created on {format(new Date(deposition.createdAt), "MMMM d, yyyy")}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/depositions/edit/${deposition.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    deposition and remove it from the system.
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
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Deposition Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="mt-1 text-muted-foreground">
                {deposition.description || "No description provided"}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium">Date & Time</h3>
              <div className="flex items-center mt-1 text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{format(new Date(deposition.date), "EEEE, MMMM d, yyyy")}</span>
                <Clock className="ml-4 mr-2 h-4 w-4" />
                <span>{format(new Date(deposition.date), "h:mm a")}</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Location</h3>
              <div className="flex items-center mt-1 text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{deposition.location || "No location specified"}</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium">Notes</h3>
              <p className="mt-1 text-muted-foreground whitespace-pre-line">
                {deposition.notes || "No notes available"}
              </p>
            </div>
            
            {deposition.documentLink && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium">Documents</h3>
                  <div className="mt-2">
                    <Button variant="outline" className="text-blue-600">
                      <FileText className="mr-2 h-4 w-4" />
                      <a 
                        href={deposition.documentLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                <div className="flex items-center mt-1">
                  <User className="mr-2 h-4 w-4" />
                  <span>
                    {deposition.client?.name || `Client #${deposition.clientId}`}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Case</h3>
                <div className="flex items-center mt-1">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>
                    {deposition.case?.title || `Case #${deposition.caseId}`}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Attorney</h3>
                <div className="flex items-center mt-1">
                  <User className="mr-2 h-4 w-4" />
                  <span>{deposition.attorneyName || "Unassigned"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => navigate(`/depositions/edit/${deposition.id}`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Deposition
              </Button>
              
              {deposition.documentLink && (
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download Document
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Deposition
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      deposition and remove it from the system.
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DepositionDetail;
