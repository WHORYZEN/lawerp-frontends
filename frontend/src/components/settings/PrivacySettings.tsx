
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from 'lucide-react';
import { PrivacyPolicyDetails } from '@/backend/settings-api';

interface PrivacySettingsProps {
  isLoading: boolean;
  privacyPolicyDetails: PrivacyPolicyDetails | null;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ 
  isLoading, 
  privacyPolicyDetails 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    // In a real app, this would initiate a data export
    setTimeout(() => {
      setIsExporting(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-[200px]" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Privacy Policy
        </h3>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Privacy Policy</Label>
              <p className="text-sm text-muted-foreground">
                View our privacy policy and learn how we protect your data
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Privacy Policy - LAW ERP 500</DialogTitle>
                  <DialogDescription>
                    Last Updated: {privacyPolicyDetails?.lastUpdated || "April 16, 2025"}
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-4 p-4">
                    {privacyPolicyDetails?.sections.map((section, index) => (
                      <div key={index}>
                        <h4 className="text-lg font-semibold">{section.title}</h4>
                        <p>{section.content}</p>
                        {section.bulletPoints && (
                          <ul className="list-disc pl-6 space-y-2 mt-2">
                            {section.bulletPoints.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                    
                    <h4 className="text-lg font-semibold">Contact Us</h4>
                    <p>
                      If you have questions or concerns about this Privacy Policy, please contact us at:
                    </p>
                    <p className="font-medium mt-2">
                      {privacyPolicyDetails?.contactInfo.companyName || "LAW ERP 500"}<br />
                      {privacyPolicyDetails?.contactInfo.address || "123 Legal Avenue"}<br />
                      {privacyPolicyDetails?.contactInfo.cityState || "Legal City, LC 12345"}<br />
                      Email: {privacyPolicyDetails?.contactInfo.email || "privacy@lawerp500.com"}<br />
                      Phone: {privacyPolicyDetails?.contactInfo.phone || "(555) 123-4567"}
                    </p>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Data Retention Policy</Label>
              <p className="text-sm text-muted-foreground">
                Learn how long we keep your data and how to request deletion
              </p>
            </div>
            <Button variant="outline">View</Button>
          </div>
          
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Export Your Data</Label>
              <p className="text-sm text-muted-foreground">
                Download a copy of all your personal data
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
