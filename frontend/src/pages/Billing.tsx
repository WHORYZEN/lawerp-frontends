
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import BillingDashboard from '@/components/billing/BillingDashboard';

const Billing: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Billing & Settlements - Law EMR</title>
      </Helmet>
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
        <BillingDashboard />
      </div>
    </PageLayout>
  );
};

export default Billing;
