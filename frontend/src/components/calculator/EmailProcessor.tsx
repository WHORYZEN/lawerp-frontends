
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/backend/messaging-api";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmailBill {
  id: string;
  sender: string;
  subject: string;
  receivedDate: string;
  hasAttachment: boolean;
  processed: boolean;
  status: "pending" | "processed" | "failed";
}

const mockEmailBills: EmailBill[] = [
  {
    id: "email1",
    sender: "cityhospital@medical.com",
    subject: "Patient Invoice #12345 - John Doe",
    receivedDate: new Date(Date.now() - 3600000).toISOString(),
    hasAttachment: true,
    processed: false,
    status: "pending"
  },
  {
    id: "email2",
    sender: "billing@mricenter.org",
    subject: "Medical Bill - Sarah Johnson - MRI Services",
    receivedDate: new Date(Date.now() - 86400000).toISOString(),
    hasAttachment: true,
    processed: false,
    status: "pending"
  },
  {
    id: "email3",
    sender: "accounting@physicaltherapy.net",
    subject: "Invoice for Physical Therapy Services",
    receivedDate: new Date(Date.now() - 172800000).toISOString(),
    hasAttachment: true,
    processed: false,
    status: "pending"
  }
];

interface EmailProcessorProps {
  onProcessBill: (billData: any) => void;
}

const EmailProcessor = ({ onProcessBill }: EmailProcessorProps) => {
  const { toast } = useToast();
  const [emailBills, setEmailBills] = useState<EmailBill[]>(mockEmailBills);
  const [activeTab, setActiveTab] = useState<string>("unprocessed");
  const [processing, setProcessing] = useState<string | null>(null);

  const handleProcessBill = async (emailId: string) => {
    setProcessing(emailId);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock bill data that would be extracted from the email attachment
    const mockBillData = {
      provider: emailBills.find(bill => bill.id === emailId)?.sender.split('@')[0] || "Unknown Provider",
      bills: [
        { 
          provider: "City Hospital", 
          description: "Emergency Room Visit", 
          originalAmount: 8500 
        },
        { 
          provider: "MRI Center", 
          description: "MRI Scan - Lower Back", 
          originalAmount: 3200 
        },
        { 
          provider: "Dr. Smith", 
          description: "Consultation", 
          originalAmount: 1500 
        }
      ]
    };
    
    // Update email status
    setEmailBills(prevBills => 
      prevBills.map(bill => 
        bill.id === emailId 
          ? { ...bill, processed: true, status: "processed" } 
          : bill
      )
    );
    
    // Pass the extracted data to parent component
    onProcessBill(mockBillData);
    
    setProcessing(null);
    
    toast({
      title: "Bill Processed Successfully",
      description: "The bill has been extracted and sent to the calculator.",
    });
  };

  const unprocessedBills = emailBills.filter(bill => !bill.processed);
  const processedBills = emailBills.filter(bill => bill.processed);

  return (
    <Card className="w-full">
      <CardHeader className="bg-lawfirm-light-blue bg-opacity-10">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-lawfirm-light-blue" />
          <CardTitle className="text-lg font-medium">Email Bill Processor</CardTitle>
        </div>
        <CardDescription>
          Process medical bills received via email automatically
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b px-6 py-2">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="unprocessed">
                Unprocessed Bills ({unprocessedBills.length})
              </TabsTrigger>
              <TabsTrigger value="processed">
                Processed Bills ({processedBills.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="unprocessed" className="p-0">
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sender</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unprocessedBills.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No unprocessed bills found
                      </TableCell>
                    </TableRow>
                  ) : (
                    unprocessedBills.map(bill => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.sender}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {bill.hasAttachment && <FileText className="h-4 w-4 text-gray-500" />}
                            <span>{bill.subject}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(bill.receivedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            onClick={() => handleProcessBill(bill.id)}
                            size="sm"
                            disabled={processing === bill.id}
                          >
                            {processing === bill.id ? "Processing..." : "Process Bill"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="processed" className="p-0">
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sender</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedBills.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No processed bills yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    processedBills.map(bill => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.sender}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span>{bill.subject}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(bill.receivedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Processed
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "View Results",
                                description: "This would open the processed results.",
                              });
                            }}
                          >
                            View Results
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailProcessor;
