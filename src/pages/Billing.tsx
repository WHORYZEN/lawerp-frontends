
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import BillingDashboard from '@/components/billing/BillingDashboard';

const Billing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Helmet>
        <title>Billing & Settlements - Law EMR</title>
      </Helmet>
      <div className="container mx-auto py-6">
        <BillingDashboard />
      </div>
    </PageLayout>
  );
};

export default Billing;
