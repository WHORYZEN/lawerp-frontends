import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Download, FileText, File, FileImage } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const PatientsDocuments: React.FC = () => {
  const documentCategories = [
    {
      id: "medical",
      label: "Medical Reports",
      documents: [
        { id: "doc1", name: "Initial Medical Evaluation", type: "pdf", date: "April 5, 2025", uploadedBy: "Dr. Smith" },
        { id: "doc2", name: "X-Ray Report", type: "pdf", date: "April 7, 2025", uploadedBy: "City Medical Center" },
        { id: "doc3", name: "Physical Therapy Plan", type: "pdf", date: "April 10, 2025", uploadedBy: "PT Associates" }
      ]
    },
    {
      id: "legal",
      label: "Legal Documents",
      documents: [
        { id: "doc4", name: "Letter of Protection", type: "pdf", date: "April 6, 2025", uploadedBy: "Jane Doelawyer" },
        { id: "doc5", name: "Letter of Representation", type: "pdf", date: "April 4, 2025", uploadedBy: "Jane Doelawyer" }
      ]
    },
    {
      id: "police",
      label: "Police Reports",
      documents: [
        { id: "doc6", name: "Accident Report", type: "pdf", date: "April 1, 2025", uploadedBy: "Police Department" }
      ]
    },
    {
      id: "bills",
      label: "Bills & Receipts",
      documents: [
        { id: "doc7", name: "Hospital Bill", type: "pdf", date: "April 10, 2025", uploadedBy: "City Hospital" },
        { id: "doc8", name: "Medication Receipt", type: "image", date: "April 12, 2025", uploadedBy: "Patient" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Document Center</h2>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-8 h-9"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue={documentCategories[0].id}>
        <TabsList>
          {documentCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {documentCategories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle>{category.label}</CardTitle>
                <CardDescription>View and download your {category.label.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
                      <div className="flex items-center">
                        {doc.type === "pdf" ? (
                          <File className="h-8 w-8 text-red-500 mr-3" />
                        ) : (
                          <FileImage className="h-8 w-8 text-blue-500 mr-3" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>Uploaded {doc.date}</span>
                            <span className="mx-1.5">•</span>
                            <span>By {doc.uploadedBy}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PatientsDocuments;
