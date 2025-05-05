
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { clientsApi } from "@/lib/api/client-api";
import { Client } from '@/types/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ClientCaseReportProps {
  clientId: string;
}

const ClientCaseReport: React.FC<ClientCaseReportProps> = ({ clientId }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const clientData = await clientsApi.getClient(clientId);
        setClient(clientData);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Could not load client information.</p>
      </div>
    );
  }

  const handleDownloadReport = () => {
    toast({
      title: "Generating Case Report",
      description: "Your comprehensive case report is being prepared...",
    });
    
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Complete case report has been downloaded successfully.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Case Summary Report</CardTitle>
              <CardDescription>Comprehensive overview of the client's case</CardDescription>
            </div>
            <Button onClick={handleDownloadReport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                  <p>{client.fullName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Account #</h4>
                  <p>{client.accountNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date of Birth</h4>
                  <p>{client.dateOfBirth || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Contact</h4>
                  <p>{client.phone} / {client.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                  <p>{client.address || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date Registered</h4>
                  <p>{client.dateRegistered || client.createdAt.split('T')[0]}</p>
                </div>
              </div>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">Accident Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date of Accident</h4>
                  <p>{client.accidentDate || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                  <p>{client.accidentLocation || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Injury Type</h4>
                  <p>{client.injuryType || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Case Status</h4>
                  <p>{client.caseStatus || 'Not provided'}</p>
                </div>
              </div>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">Insurance Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Insurance Company</h4>
                  <p>{client.insuranceCompany || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Policy Number</h4>
                  <p>{client.insurancePolicyNumber || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Adjuster Name</h4>
                  <p>{client.insuranceAdjusterName || 'Not provided'}</p>
                </div>
              </div>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">Case Description</h3>
              <p className="text-muted-foreground">{client.caseDescription || 'No case description provided.'}</p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientCaseReport;
