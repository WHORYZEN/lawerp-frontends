
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText, MessageSquare, Briefcase, Loader2, Plus } from "lucide-react";
import { Client } from "@/types/client";
import { Case } from "@/types/case"; 
import { casesApi } from "@/lib/api/mongodb-api";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ClientDetailsProps {
  client: Client;
  onBack: () => void;
  onEdit: (client: Client) => void;
}

const ClientDetails = ({ client, onBack, onEdit }: ClientDetailsProps) => {
  const [linkedCases, setLinkedCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinkedCases = async () => {
      try {
        setLoading(true);
        const cases = await casesApi.getCasesByClientId(client.id);
        setLinkedCases(cases);
      } catch (error) {
        console.error("Failed to fetch linked cases:", error);
        toast({
          title: "Error",
          description: "Failed to load linked cases. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedCases();
  }, [client.id, toast]);

  const handleCreateCase = () => {
    navigate(`/cases/create?clientId=${client.id}`);
  };

  const handleViewCase = (caseId: string) => {
    navigate(`/cases/${caseId}`);
  };

  const handleUploadDocument = () => {
    navigate(`/documents?clientId=${client.id}`);
  };

  const handleLogCommunication = () => {
    navigate(`/messages?clientId=${client.id}`);
  };

  const getBadgeVariant = (status: string) => {
    switch(status) {
      case 'open':
        return 'default';
      case 'closed':
        return 'secondary';
      case 'settled':
        return 'outline';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="gap-1" 
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
        <Button 
          className="gap-1"
          onClick={() => onEdit(client)}
        >
          <Edit className="h-4 w-4" />
          Edit Client
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{client.fullName}</CardTitle>
            <div className="flex flex-wrap gap-1">
              {client.tags?.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Contact Information</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Email:</span> {client.email}</p>
                  <p><span className="font-medium">Phone:</span> {client.phone}</p>
                  {client.address && <p><span className="font-medium">Address:</span> {client.address}</p>}
                </div>
              </div>
              
              {client.companyName && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">Company</h3>
                  <p className="mt-2">{client.companyName}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Client Since</h3>
                <p className="mt-2">{format(new Date(client.createdAt), 'MMMM d, yyyy')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Last Updated</h3>
                <p className="mt-2">{format(new Date(client.updatedAt), 'MMMM d, yyyy')}</p>
              </div>
              
              {client.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">Notes</h3>
                  <p className="mt-2 whitespace-pre-wrap">{client.notes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="cases" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="cases" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Cases
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Communication
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cases">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Linked Cases</CardTitle>
                <Button variant="outline" onClick={handleCreateCase} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Case
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Loading cases...</p>
                </div>
              ) : linkedCases.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No cases found for this client.</p>
                  <Button variant="outline" className="mt-4" onClick={handleCreateCase}>Create First Case</Button>
                </div>
              ) : (
                <div className="divide-y">
                  {linkedCases.map(caseItem => (
                    <div key={caseItem.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-medium">{caseItem.title}</h3>
                        <div className="flex items-center mt-1 gap-3">
                          <Badge variant={getBadgeVariant(caseItem.status)}>
                            {caseItem.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Case #{caseItem.caseNumber}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {caseItem.description?.substring(0, 100)}{caseItem.description && caseItem.description.length > 100 ? '...' : ''}
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => handleViewCase(caseItem.id)}>View Case</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Client Documents</CardTitle>
                <Button variant="outline" onClick={handleUploadDocument} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No documents found for this client.</p>
                <Button variant="outline" className="mt-4" onClick={handleUploadDocument}>Upload First Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Communication Log</CardTitle>
                <Button variant="outline" onClick={handleLogCommunication} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Message
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No communication records found.</p>
                <Button variant="outline" className="mt-4" onClick={handleLogCommunication}>Log Communication</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetails;
