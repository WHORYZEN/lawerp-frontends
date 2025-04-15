
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceManagement from './InvoiceManagement';
import SettlementsManagement from './SettlementsManagement';
import LettersManagement from './LettersManagement';
import { DollarSign, FileText, Scale } from 'lucide-react';

const BillingDashboard = () => {
  const [activeTab, setActiveTab] = useState('invoices');

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Settlements</h1>
          <p className="text-gray-500 mt-1">Track invoices, manage settlements and generate payment letters</p>
        </div>
      </div>
      
      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 pb-8">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <DollarSign className="h-6 w-6 text-amber-600" />
            Financial Management
          </CardTitle>
          <CardDescription>
            Comprehensive tools to manage billing, settlements, and financial documents
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <div className="px-6">
                <TabsList className="h-14 w-full bg-transparent justify-start gap-8 mb-[-1px]">
                  <TabsTrigger 
                    value="invoices" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium"
                  >
                    <DollarSign className="mr-2 h-5 w-5" />
                    <span>Invoices</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settlements" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium"
                  >
                    <Scale className="mr-2 h-5 w-5" />
                    <span>Settlements</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="letters" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    <span>Letters</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div>
              <TabsContent value="invoices" className="m-0 p-6">
                <InvoiceManagement />
              </TabsContent>
              
              <TabsContent value="settlements" className="m-0 p-6">
                <SettlementsManagement />
              </TabsContent>
              
              <TabsContent value="letters" className="m-0 p-6">
                <LettersManagement />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingDashboard;
