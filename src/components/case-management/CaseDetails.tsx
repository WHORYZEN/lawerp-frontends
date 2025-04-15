
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText, MessageSquare, User, Calendar, Clock } from "lucide-react";
import { Case } from "@/types/case";
import { Client } from "@/types/client";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CaseDetailsProps {
  caseItem: Case;
  client: Client | undefined;
  onBack: () => void;
  onEdit: () => void;
}

const CaseDetails = ({ caseItem, client, onBack, onEdit }: CaseDetailsProps) => {
  const navigate = useNavigate();

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
          Back to Cases
        </Button>
        <Button 
          className="gap-1"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          Edit Case
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl mr-2">{caseItem.title}</CardTitle>
              <div className="flex items-center mt-1 gap-2">
                <Badge variant={getBadgeVariant(caseItem.status)}>
                  {caseItem.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Case #{caseItem.caseNumber}
                </span>
              </div>
            </div>
            <div className="flex mt-2 md:mt-0">
              {client && (
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <User className="h-4 w-4" />
                  View Client Details
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Case Type</h3>
                <p className="mt-1 capitalize">{caseItem.caseType.replace(/-/g, ' ')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Client</h3>
                <p className="mt-1">{client ? client.fullName : "Unknown Client"}</p>
              </div>
              
              {caseItem.assignedTo && caseItem.assignedTo.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">Assigned To</h3>
                  <div className="mt-1 space-y-1">
                    {caseItem.assignedTo.map((assignee, index) => (
                      <div key={index}>{assignee}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">Open Date</h3>
                  <p className="mt-1">{format(new Date(caseItem.openDate), 'MMMM d, yyyy')}</p>
                </div>
                
                {caseItem.closeDate && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground">Close Date</h3>
                    <p className="mt-1">{format(new Date(caseItem.closeDate), 'MMMM d, yyyy')}</p>
                  </div>
                )}
                
                {caseItem.courtDate && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground">Court Date</h3>
                    <p className="mt-1">{format(new Date(caseItem.courtDate), 'MMMM d, yyyy')}</p>
                  </div>
                )}
                
                {caseItem.statueOfLimitations && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground">Statue of Limitations</h3>
                    <p className="mt-1">{format(new Date(caseItem.statueOfLimitations), 'MMMM d, yyyy')}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Last Updated</h3>
                <p className="mt-1">{format(new Date(caseItem.updatedAt), 'MMMM d, yyyy')}</p>
              </div>
            </div>
            
            {caseItem.description && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Description</h3>
                <p className="mt-1 whitespace-pre-wrap">{caseItem.description}</p>
              </div>
            )}
            
            {caseItem.notes && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Notes</h3>
                <p className="mt-1 whitespace-pre-wrap">{caseItem.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline
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
        
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Case Timeline</CardTitle>
                <Button variant="outline">Add Timeline Event</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No timeline events found for this case.</p>
                <Button variant="outline" className="mt-4">Add First Event</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Case Documents</CardTitle>
                <Button variant="outline">Upload Document</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No documents found for this case.</p>
                <Button variant="outline" className="mt-4">Upload First Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Communication Log</CardTitle>
                <Button variant="outline">New Message</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No communication records found.</p>
                <Button variant="outline" className="mt-4">Log Communication</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaseDetails;
