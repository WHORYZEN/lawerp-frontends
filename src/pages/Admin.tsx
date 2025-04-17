
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useAdmin } from '@/hooks/use-admin';
import { useToast } from '@/components/ui/use-toast';

const Admin: React.FC = () => {
  const { canAccessAdminPanel } = useAdmin();
  const { toast } = useToast();
  
  if (!canAccessAdminPanel) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access the admin panel",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" />;
  }

  return (
    <PageLayout>
      <Helmet>
        <title>Admin Panel - Law EMR</title>
      </Helmet>
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
        <AdminDashboard />
      </div>
    </PageLayout>
  );
};

export default Admin;
