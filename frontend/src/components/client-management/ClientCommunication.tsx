
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, MessageSquare, Phone } from "lucide-react";
import { clientsApi, Communication } from "@/lib/api/client-api";
import { Badge } from '@/components/ui/badge';

interface ClientCommunicationProps {
  clientId: string;
}

const ClientCommunication: React.FC<ClientCommunicationProps> = ({ clientId }) => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        setLoading(true);
        const comms = await clientsApi.getCommunications(clientId);
        setCommunications(comms);
      } catch (error) {
        console.error("Error fetching communications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunications();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-5 w-5 text-blue-500" />;
      case 'sms': return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'phone': return <Phone className="h-5 w-5 text-purple-500" />;
      default: return <Mail className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication History</CardTitle>
      </CardHeader>
      <CardContent>
        {communications.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No communication history found for this client.</p>
        ) : (
          <div className="space-y-4">
            {communications.sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime())
              .map((communication) => (
                <div key={communication.id} className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getCommunicationIcon(communication.type)}
                      <div className="ml-2">
                        <h3 className="font-medium">{communication.subject}</h3>
                        <p className="text-xs text-muted-foreground">{communication.date} at {communication.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {communication.actionRequired && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                          Action Required
                        </Badge>
                      )}
                      <Badge variant="outline" className={communication.read ? "bg-green-100" : "bg-blue-100"}>
                        {communication.read ? "Read" : "Unread"}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-sm whitespace-pre-line">{communication.content}</p>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientCommunication;
