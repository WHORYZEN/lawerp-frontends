
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProviderManagement from './ProviderManagement';
import MedicalRecordsManagement from './MedicalRecordsManagement';
import { useToast } from "@/hooks/use-toast";
import { Stethoscope, FileHeart } from 'lucide-react';

const MedicalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('providers');
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Management</h1>
          <p className="text-gray-500 mt-1">Track healthcare providers and medical records for your cases</p>
        </div>
      </div>
      
      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100 pb-8">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileHeart className="h-6 w-6 text-green-600" />
            Medical Record System
          </CardTitle>
          <CardDescription>
            Centralized management of healthcare providers and patient medical records
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <div className="px-6">
                <TabsList className="h-14 w-full bg-transparent justify-start gap-8 mb-[-1px]">
                  <TabsTrigger 
                    value="providers" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium"
                  >
                    <Stethoscope className="mr-2 h-5 w-5" />
                    <span>Healthcare Providers</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="records" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium"
                  >
                    <FileHeart className="mr-2 h-5 w-5" />
                    <span>Medical Records</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div>
              <TabsContent value="providers" className="m-0 p-6">
                <ProviderManagement />
              </TabsContent>
              
              <TabsContent value="records" className="m-0 p-6">
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
