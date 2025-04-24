
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, FilePdf, Eye } from 'lucide-react';

const PatientsLegalDocuments: React.FC = () => {
  const legalDocuments = [
    {
      id: "lor",
      title: "Letter of Representation",
      date: "April 4, 2025",
      description: "Official letter stating that LYZ Law Firm represents you in your personal injury case.",
      signed: true,
      parties: ["LYZ Law Firm", "Client"]
    },
    {
      id: "lop",
      title: "Letter of Protection",
      date: "April 6, 2025",
      description: "Agreement to pay medical providers from the settlement of your case.",
      signed: true,
      parties: ["LYZ Law Firm", "Client", "City Medical Center", "PT Associates"]
    },
    {
      id: "release",
      title: "Medical Records Release",
      date: "April 4, 2025",
      description: "Authorization for your attorney to access your medical records relevant to the case.",
      signed: true,
      parties: ["Client", "Healthcare Providers"]
    },
    {
      id: "fee",
      title: "Fee Agreement",
      date: "April 4, 2025",
      description: "Agreement outlining the contingency fee structure for your case.",
      signed: true,
      parties: ["LYZ Law Firm", "Client"]
    },
    {
      id: "demand",
      title: "Demand Letter",
      date: "Pending",
      description: "Letter to the insurance company outlining your claim and requesting compensation.",
      signed: false,
      status: "In preparation",
      parties: ["LYZ Law Firm", "Insurance Company"]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Legal Documents</CardTitle>
          <CardDescription>Important legal documents related to your case</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {legalDocuments.map(doc => (
              <div key={doc.id} className="border rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <FilePdf className="h-10 w-10 text-red-500 mr-4 mt-0.5" />
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <span className="font-medium">Date:</span>
                        <span className="ml-1">{doc.date}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">Status:</span>
                        <span className="ml-1">{doc.signed ? "Signed" : doc.status}</span>
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="font-medium">Parties:</span>
                        <span className="ml-1">{doc.parties.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settlement Status</CardTitle>
          <CardDescription>Current status of your case settlement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-yellow-800 font-medium">Case In Active Treatment Phase</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Your case is currently in the active treatment phase. Settlement negotiations have not yet begun, as we need to wait until your treatment is complete to fully understand the extent of your damages.
            </p>
            <div className="mt-4 flex items-center">
              <div className="flex-1">
                <div className="h-2 w-full bg-yellow-200 rounded-full">
                  <div className="h-2 bg-yellow-500 rounded-full w-[30%]"></div>
                </div>
              </div>
              <span className="ml-4 text-sm font-medium text-yellow-700">30%</span>
            </div>
            <div className="flex justify-between mt-1 text-xs text-yellow-700">
              <span>Case Opened</span>
              <span>Active Treatment</span>
              <span>Documentation</span>
              <span>Negotiation</span>
              <span>Settlement</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsLegalDocuments;
