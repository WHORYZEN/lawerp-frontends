
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttorneyList from './AttorneyList';
import AttorneyForm from './AttorneyForm';
import AttorneyDetail from './AttorneyDetail';

const AttorneyManagement = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'all';
  const [selectedAttorneyId, setSelectedAttorneyId] = useState<string | null>(null);
  
  const handleViewAttorney = (id: string) => {
    setSelectedAttorneyId(id);
  };
  
  const handleBackToList = () => {
    setSelectedAttorneyId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attorney Management</h1>
        <p className="text-muted-foreground">
          Manage attorneys and law firm staff members
        </p>
      </div>

      {selectedAttorneyId ? (
        <AttorneyDetail 
          attorneyId={selectedAttorneyId} 
          onBack={handleBackToList} 
        />
      ) : (
        <Tabs defaultValue={tab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Attorneys</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="associates">Associates</TabsTrigger>
            <TabsTrigger value="paralegals">Paralegals</TabsTrigger>
            <TabsTrigger value="interns">Interns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <AttorneyList onViewAttorney={handleViewAttorney} filter="all" />
          </TabsContent>
          <TabsContent value="partners">
            <AttorneyList onViewAttorney={handleViewAttorney} filter="Partner" />
          </TabsContent>
          <TabsContent value="associates">
            <AttorneyList onViewAttorney={handleViewAttorney} filter="Associate" />
          </TabsContent>
          <TabsContent value="paralegals">
            <AttorneyList onViewAttorney={handleViewAttorney} filter="Paralegal" />
          </TabsContent>
          <TabsContent value="interns">
            <AttorneyList onViewAttorney={handleViewAttorney} filter="Intern" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AttorneyManagement;
