
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientList from "./ClientList";
import ClientForm from "./ClientForm";
import { Client } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";

// Mock data for initial development
const mockClients: Client[] = [
  {
    id: "1",
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    companyName: "Acme Inc.",
    address: "123 Main St, Anytown, USA",
    tags: ["commercial", "insurance"],
    notes: "Initial consultation completed",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-02-20T14:45:00Z"
  },
  {
    id: "2",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    companyName: "Smith & Co",
    address: "456 Oak Ave, Sometown, USA",
    tags: ["personal injury", "accident"],
    notes: "Case in progress",
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2023-04-05T11:20:00Z"
  },
  {
    id: "3",
    fullName: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 456-7890",
    companyName: "Johnson Enterprises",
    tags: ["private", "third party"],
    createdAt: "2023-05-20T15:45:00Z",
    updatedAt: "2023-05-20T15:45:00Z"
  }
];

const ClientManagement = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [activeTab, setActiveTab] = useState("view");
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const handleAddClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const newClient: Client = {
      id: uuidv4(),
      ...clientData,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    setClients([...clients, newClient]);
    setActiveTab("view");
    toast({
      title: "Client Added",
      description: `${newClient.fullName} has been added to your clients.`,
    });
  };

  const handleEditClient = (clientData: Client) => {
    const updatedClients = clients.map(client => 
      client.id === clientData.id 
        ? { ...clientData, updatedAt: new Date().toISOString() } 
        : client
    );
    
    setClients(updatedClients);
    setActiveTab("view");
    setClientToEdit(null);
    toast({
      title: "Client Updated",
      description: `${clientData.fullName}'s information has been updated.`,
    });
  };

  const handleDeleteClient = (clientId: string) => {
    const clientName = clients.find(c => c.id === clientId)?.fullName;
    setClients(clients.filter(client => client.id !== clientId));
    toast({
      title: "Client Deleted",
      description: `${clientName} has been removed from your clients.`,
    });
  };

  const startEditClient = (client: Client) => {
    setClientToEdit(client);
    setActiveTab("add");
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
            onDeleteClient={handleDeleteClient}
          />
        </TabsContent>
        
        <TabsContent value="add" className="p-6">
          <ClientForm 
            initialData={clientToEdit} 
            onSubmit={clientToEdit ? handleEditClient : handleAddClient} 
            onCancel={() => {
              setClientToEdit(null);
              setActiveTab("view");
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientManagement;
