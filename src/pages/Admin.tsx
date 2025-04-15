
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Admin Panel - Law EMR</title>
      </Helmet>
      <AdminDashboard />
    </PageLayout>
  );
};

export default Admin;
