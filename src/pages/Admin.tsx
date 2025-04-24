
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { UserProvider } from '@/contexts/UserContext';

const Admin: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Admin Panel - Law EMR</title>
      </Helmet>
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen pt-4">
        <UserProvider>
          <AdminDashboard />
        </UserProvider>
      </div>
    </PageLayout>
  );
};

export default Admin;
