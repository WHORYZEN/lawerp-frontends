
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { UserProvider } from '@/contexts/UserContext';

const Admin: React.FC = () => {
  return (
    <UserProvider>
      <PageLayout>
        <Helmet>
          <title>Admin Panel - Law EMR</title>
        </Helmet>
        <AdminDashboard />
      </PageLayout>
    </UserProvider>
  );
};

export default Admin;

