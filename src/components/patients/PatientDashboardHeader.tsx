
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink } from 'lucide-react';
import { Client } from '@/types/client';
import { useToast } from '@/hooks/use-toast';

interface PatientDashboardHeaderProps {
  client?: Client;  // Optional client data
  caseStatus: string;
  lastUpdated: string;
}

const PatientDashboardHeader: React.FC<PatientDashboardHeaderProps> = ({
  client,
  caseStatus,
  lastUpdated
}) => {
  const { toast } = useToast();

  const showToastNotification = () => {
    toast({
      title: "Client Portal Access",
      description: "This would connect to the full client profile in a real implementation.",
    });
  };

  return (
    <Card className="bg-white border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <Avatar className="h-14 w-14 mr-4">
              <AvatarImage src={client?.id ? `https://i.pravatar.cc/100?u=${client.id}` : undefined} />
              <AvatarFallback>{client?.fullName?.substring(0, 2) || 'CL'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">{client?.fullName || "Patient Portal"}</h2>
                {client && (
                  <Link to={`/clients/${client.id}`} onClick={showToastNotification}>
                    <Button variant="ghost" size="sm" className="ml-2 h-7">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Client Profile
                    </Button>
                  </Link>
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <span>Case Status: </span>
                <Badge variant="secondary" className="ml-2">{caseStatus}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Last updated: {lastUpdated}</p>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <Button variant="default" className="w-full sm:w-auto">
              Contact Your Attorney
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDashboardHeader;
