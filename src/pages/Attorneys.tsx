
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import AttorneyManagement from '../components/attorney-management/AttorneyManagement';

const Attorneys = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Attorneys | LYZ Law Firm</title>
      </Helmet>
      <AttorneyManagement />
    </PageLayout>
  );
};

export default Attorneys;
