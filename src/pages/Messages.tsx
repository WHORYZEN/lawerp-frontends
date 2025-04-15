
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import MessagingDashboard from '@/components/messaging/MessagingDashboard';

const Messages: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Helmet>
        <title>Messaging - Law EMR</title>
      </Helmet>
      <div className="container mx-auto py-6">
        <MessagingDashboard />
      </div>
    </PageLayout>
  );
};

export default Messages;
