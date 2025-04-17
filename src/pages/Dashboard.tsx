
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
      <div className="space-y-6">
        <DashboardOverview />
      </div>
    </PageLayout>
  );
};

export default Dashboard;
