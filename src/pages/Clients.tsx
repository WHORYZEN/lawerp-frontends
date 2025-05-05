
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ClientManagement from "@/components/client-management/ClientManagement";

const Clients = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Client Management - LAW ERP 500</title>
      </Helmet>
      
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Client Management</h1>
          <p className="text-muted-foreground">
            View, add, edit and manage all your clients and their cases
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route index element={<ClientManagement />} />
            <Route path="*" element={<ClientManagement />} />
          </Routes>
        </div>
      </div>
    </PageLayout>
  );
};

export default Clients;
