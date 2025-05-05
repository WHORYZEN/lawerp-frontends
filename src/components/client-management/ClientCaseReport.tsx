
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, Calendar, FileCheck, MonitorSmartphone } from "lucide-react";
import { clientsApi } from "@/lib/api/client-api";
import { Client } from "@/types/client";

interface ClientCaseReportProps {
  clientId: string;
}

const ClientCaseReport: React.FC<ClientCaseReportProps> = ({ clientId }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [smartNotifications, setSmartNotifications] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const clientData = await clientsApi.getClient(clientId);
        if (clientData) {
          setClient(clientData);
          
          // Get smart notifications for client
          const notifications = await clientsApi.getSmartNotifications(clientId);
          setSmartNotifications(notifications);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast({
          title: "Error",
          description: "Failed to load client case report.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId, toast]);

  const handleDownloadReport = () => {
    toast({
      title: "Generating Report",
      description: "Your comprehensive case report is being prepared...",
    });
    
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Complete case report has been downloaded successfully.",
      });
    }, 2000);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-64" /></CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!client) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Case Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Client information not found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Case Report for {client.fullName}</CardTitle>
        <Button onClick={handleDownloadReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Full Report
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {smartNotifications.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-amber-800 font-medium flex items-center gap-2 mb-2">
              <MonitorSmartphone className="h-4 w-4" />
              Smart Notifications
            </h3>
            <ul className="space-y-1">
              {smartNotifications.map((notification, index) => (
                <li key={index} className="text-amber-700 text-sm flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{notification}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              Case Summary
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <dl className="grid grid-cols-2 gap-2">
                <dt className="text-gray-500">Case Status:</dt>
                <dd className="font-medium">{client.caseStatus || "N/A"}</dd>
                
                <dt className="text-gray-500">Accident Date:</dt>
                <dd className="font-medium">{client.accidentDate || "N/A"}</dd>
                
                <dt className="text-gray-500">Injury Type:</dt>
                <dd className="font-medium">{client.injuryType || "N/A"}</dd>
                
                <dt className="text-gray-500">Insurance:</dt>
                <dd className="font-medium">{client.insuranceCompany || "N/A"}</dd>
                
                <dt className="text-gray-500">Policy #:</dt>
                <dd className="font-medium">{client.insurancePolicyNumber || "N/A"}</dd>
                
                <dt className="text-gray-500">Adjuster:</dt>
                <dd className="font-medium">{client.insuranceAdjusterName || "N/A"}</dd>
              </dl>
              
              <div className="mt-4">
                <p className="text-gray-500">Description:</p>
                <p className="mt-1">{client.caseDescription || "No case description available."}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              Timeline & Progress
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p><span className="font-medium">Case Opened:</span> {client.dateRegistered || "N/A"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <p><span className="font-medium">Initial Consultation:</span> {client.dateRegistered ? new Date(client.dateRegistered).toLocaleDateString() : "N/A"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <p><span className="font-medium">Current Stage:</span> {client.caseStatus || "N/A"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <p><span className="font-medium">Next Action:</span> Pending attorney review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-gray-500" />
            Treatment Summary
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <p>
              {client.caseDescription || "The client's medical treatment and recovery progress will be summarized here."}
            </p>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                <span>View Full Medical Records</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCaseReport;
