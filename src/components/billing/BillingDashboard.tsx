
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceManagement from './InvoiceManagement';
import SettlementsManagement from './SettlementsManagement';
import LettersManagement from './LettersManagement';

const BillingDashboard = () => {
  const [activeTab, setActiveTab] = useState('invoices');

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Law EMR Billing & Settlements</CardTitle>
          <CardDescription>Manage invoices, settlements, and billing documents</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="settlements">Settlements</TabsTrigger>
              <TabsTrigger value="letters">Letters</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <TabsContent value="invoices" className="m-0">
                <InvoiceManagement />
              </TabsContent>
              
              <TabsContent value="settlements" className="m-0">
                <SettlementsManagement />
              </TabsContent>
              
              <TabsContent value="letters" className="m-0">
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
