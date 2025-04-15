
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import SettingsDashboard from '@/components/settings/SettingsDashboard';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Helmet>
        <title>Settings - Law EMR</title>
      </Helmet>
      <div className="container mx-auto py-6">
        <SettingsDashboard />
      </div>
    </PageLayout>
  );
};

export default Settings;
