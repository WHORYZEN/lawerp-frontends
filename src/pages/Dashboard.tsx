
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

const Dashboard: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Dashboard - LAW ERP 500</title>
      </Helmet>
      <div className="container p-4">
        <DashboardOverview />
      </div>
    </PageLayout>
  );
};

export default Dashboard;
