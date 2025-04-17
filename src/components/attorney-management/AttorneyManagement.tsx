
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttorneyList from './AttorneyList';
import AttorneyForm from './AttorneyForm';

interface AttorneyManagementProps {
  activeTab?: string;
}

const AttorneyManagement = ({ activeTab = 'all' }: AttorneyManagementProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedAttorneyId, setSelectedAttorneyId] = useState<string | null>(null);
  
  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', value);
    navigate({ search: newParams.toString() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attorney Management</h1>
        <p className="text-muted-foreground">
          Manage attorneys and law firm staff members
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Attorneys</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="associates">Associates</TabsTrigger>
          <TabsTrigger value="paralegals">Paralegals</TabsTrigger>
          <TabsTrigger value="interns">Interns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <AttorneyList onViewAttorney={setSelectedAttorneyId} filter="all" />
        </TabsContent>
        <TabsContent value="partners">
          <AttorneyList onViewAttorney={setSelectedAttorneyId} filter="Partner" />
        </TabsContent>
        <TabsContent value="associates">
          <AttorneyList onViewAttorney={setSelectedAttorneyId} filter="Associate" />
        </TabsContent>
        <TabsContent value="paralegals">
          <AttorneyList onViewAttorney={setSelectedAttorneyId} filter="Paralegal" />
        </TabsContent>
        <TabsContent value="interns">
          <AttorneyList onViewAttorney={setSelectedAttorneyId} filter="Intern" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttorneyManagement;
