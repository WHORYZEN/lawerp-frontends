
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Plus } from "lucide-react";
import { clientsApi } from "@/lib/api/client-api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientMedicalRecordsProps {
  clientId: string;
}

const ClientMedicalRecords: React.FC<ClientMedicalRecordsProps> = ({ clientId }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setLoading(true);
        const docs = await clientsApi.getDocumentsByType(clientId, 'medical');
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching medical records:", error);
        toast({
          title: "Error",
          description: "Failed to load medical records.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [clientId, toast]);

  const handleUploadRecord = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to upload new medical records will be available in a future update.",
    });
  };

  const handleDownload = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (doc) {
      toast({
        title: "Downloading Document",
        description: `Downloading ${doc.name}...`,
      });
    }
  };

  const handleViewDocument = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (doc) {
      toast({
        title: "Opening Document",
        description: `Opening ${doc.name} in document viewer...`,
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medical Records</CardTitle>
        <Button onClick={handleUploadRecord} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Upload Record
        </Button>
      </CardHeader>
      <CardContent>
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
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No medical records found for this client.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleUploadRecord}
            >
              Upload First Record
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.fileType.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewDocument(doc.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownload(doc.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientMedicalRecords;
