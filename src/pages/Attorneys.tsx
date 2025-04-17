
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import AttorneyManagement from '../components/attorney-management/AttorneyManagement';

const Attorneys = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'all';

  return (
    <PageLayout>
      <Helmet>
        <title>Attorneys | LYZ Law Firm</title>
      </Helmet>
      <AttorneyManagement activeTab={tab} />
    </PageLayout>
  );
};

export default Attorneys;
