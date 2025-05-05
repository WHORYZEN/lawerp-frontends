
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, MessageSquare, Phone } from "lucide-react";
import { clientsApi, Communication } from "@/lib/api/client-api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ClientCommunicationProps {
  clientId: string;
}

const ClientCommunication: React.FC<ClientCommunicationProps> = ({ clientId }) => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Communication | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        setLoading(true);
        const data = await clientsApi.getCommunications(clientId);
        setCommunications(data);
      } catch (error) {
        console.error("Error fetching communications:", error);
        toast({
          title: "Error",
          description: "Failed to load communication history.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCommunications();
  }, [clientId, toast]);

  const filteredCommunications = () => {
    if (activeTab === "all") return communications;
    return communications.filter(comm => comm.type === activeTab);
  };

  const handleNewCommunication = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to add new communications will be available in a future update.",
    });
  };

  const handleViewMessage = (message: Communication) => {
    setSelectedMessage(message);
    
    // Mark as read if not already
    if (!message.read) {
      clientsApi.markCommunicationAsRead(message.id).then(updatedMessage => {
        if (updatedMessage) {
          setCommunications(prevComms => 
            prevComms.map(comm => 
              comm.id === message.id ? { ...comm, read: true } : comm
            )
          );
        }
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Communication History</CardTitle>
        <Button onClick={handleNewCommunication} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCommunications().length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No communications found in this category.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleNewCommunication}
                >
                  Create First Message
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommunications().map((comm) => (
                    <TableRow key={comm.id} className={!comm.read ? "bg-blue-50" : undefined}>
                      <TableCell>
                        <div>
                          <div>{comm.date}</div>
                          <div className="text-xs text-muted-foreground">{comm.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(comm.type)}
                          <span>{comm.type.toUpperCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell>{comm.sender}</TableCell>
                      <TableCell>{comm.subject}</TableCell>
                      <TableCell>
                        {!comm.read && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Unread
                          </Badge>
                        )}
                        {comm.actionRequired && (
                          <Badge className="bg-red-100 text-red-800 ml-1">
                            Action Required
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost"
                              onClick={() => handleViewMessage(comm)}
                            >
                              View
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-full sm:max-w-xl">
                            <SheetHeader>
                              <SheetTitle>{selectedMessage?.subject}</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 space-y-4">
                              <div className="flex justify-between text-sm">
                                <div>
                                  <span className="text-muted-foreground">From: </span>
                                  {selectedMessage?.sender}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Date: </span>
                                  {selectedMessage?.date} {selectedMessage?.time}
                                </div>
                              </div>
                              <div className="border-t pt-4">
                                <p className="whitespace-pre-line">{selectedMessage?.content}</p>
                              </div>
                              {selectedMessage?.actionRequired && (
                                <div className="border-t border-red-200 bg-red-50 p-4 rounded-md mt-4">
                                  <p className="text-red-800 font-medium">Action Required</p>
                                  <p className="text-sm text-red-700">This message requires your attention or response.</p>
                                </div>
                              )}
                            </div>
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientCommunication;
