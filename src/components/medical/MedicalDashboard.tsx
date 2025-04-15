
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProviderManagement from './ProviderManagement';
import MedicalRecordsManagement from './MedicalRecordsManagement';
import { useToast } from "@/hooks/use-toast";

const MedicalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('providers');
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Medical Management</CardTitle>
          <CardDescription>
            Manage healthcare providers and medical records for your cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <TabsContent value="providers" className="m-0">
                <ProviderManagement />
              </TabsContent>
              
              <TabsContent value="records" className="m-0">
                <MedicalRecordsManagement />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalDashboard;
