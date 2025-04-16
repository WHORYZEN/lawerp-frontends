
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import SettingsDashboard from '@/components/settings/SettingsDashboard';

const Settings: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Settings - Law EMR</title>
      </Helmet>
      <div className="w-full max-w-6xl mx-auto">
        <SettingsDashboard />
      </div>
    </PageLayout>
  );
};

export default Settings;
