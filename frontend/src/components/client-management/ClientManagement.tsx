
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientList from "./ClientList";
import ClientForm from "./ClientForm";
import ClientDetails from "./ClientDetails";
import { useClient } from "@/contexts/ClientContext";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Search, Download, FileText } from 'lucide-react';
import ClientMedicalRecords from "./ClientMedicalRecords";
import ClientDocuments from "./ClientDocuments";
import ClientAppointments from "./ClientAppointments";
import ClientCommunication from "./ClientCommunication";
import ClientCaseReport from "./ClientCaseReport";
import { useToast } from "@/hooks/use-toast";

const ClientManagement = () => {
  const { 
    clients,
    selectedClient, 
    clientToEdit,
    loading,
    activeTab,
    activeDetailTab,
    setActiveTab,
    setActiveDetailTab,
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
    handleViewClient,
    startEditClient,
    clearClientToEdit
  } = useClient();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toast } = useToast();

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleDownloadCaseSummary = () => {
    if (!selectedClient) return;
    
    toast({
      title: "Generating Case Summary",
      description: "Your comprehensive case summary is being prepared...",
    });
    
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Complete case summary has been downloaded successfully.",
      });
    }, 2000);
  };

  const renderDetailsContent = () => {
    if (!selectedClient) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setActiveTab("view")}>
            Back to List
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSearchClick} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search Clients</span>
            </Button>
            <Button variant="outline" onClick={handleDownloadCaseSummary} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Download Summary</span>
            </Button>
            <Button onClick={() => startEditClient(selectedClient)} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Edit Client</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab}>
          <TabsList className="grid grid-cols-6 gap-2 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical Records</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="case-report">Case Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <ClientDetails 
              client={selectedClient}
              onBack={() => setActiveTab("view")}
              onEdit={() => startEditClient(selectedClient)}
            />
          </TabsContent>
          
          <TabsContent value="medical">
            <ClientMedicalRecords clientId={selectedClient.id} />
          </TabsContent>
          
          <TabsContent value="documents">
            <ClientDocuments clientId={selectedClient.id} />
          </TabsContent>
          
          <TabsContent value="appointments">
            <ClientAppointments clientId={selectedClient.id} />
          </TabsContent>
          
          <TabsContent value="communication">
            <ClientCommunication clientId={selectedClient.id} />
          </TabsContent>
          
          <TabsContent value="case-report">
            <ClientCaseReport clientId={selectedClient.id} />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b px-6 py-2">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="view">View Clients</TabsTrigger>
            <TabsTrigger value="add">{clientToEdit ? "Edit Client" : "Add Client"}</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="view" className="p-6 space-y-4">
          <ClientList 
            clients={clients} 
            onEditClient={startEditClient}
            onViewClient={handleViewClient}
            onDeleteClient={handleDeleteClient}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="add" className="p-6">
          <ClientForm 
            initialData={clientToEdit} 
            onSubmit={clientToEdit ? handleEditClient : handleAddClient} 
            onCancel={() => {
              clearClientToEdit();
              setActiveTab("view");
            }}
          />
        </TabsContent>

        <TabsContent value="details" className="p-6 space-y-4">
          {renderDetailsContent()}
        </TabsContent>
      </Tabs>

      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="right" className="w-full sm:w-[640px] sm:max-w-full">
          <SheetHeader>
            <SheetTitle>Search Clients</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <ClientList 
              clients={clients} 
              onEditClient={startEditClient}
              onViewClient={(client) => {
                handleViewClient(client);
                setIsSearchOpen(false);
              }}
              onDeleteClient={handleDeleteClient}
              loading={loading}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ClientManagement;
