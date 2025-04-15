
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Plus, Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Case } from "@/types/case";
import { casesApi } from "@/lib/api/mongodb-api";
import CaseList from "./CaseList";
import CaseDetails from "./CaseDetails";
import CaseForm from "./CaseForm";
import { Client } from "@/types/client";
import { clientsApi } from "@/lib/api/mongodb-api";

const CaseManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [cases, setCases] = useState<Case[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get clientId from URL if available
  const clientIdFromURL = searchParams.get('clientId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all cases
        const casesData = await casesApi.getCases();
        setCases(casesData);
        
        // Fetch all clients for reference
        const clientsData = await clientsApi.getClients();
        setClients(clientsData);
        
        // If there's an ID in the URL, fetch and select that case
        if (id) {
          const caseItem = await casesApi.getCase(id);
          if (caseItem) {
            setSelectedCase(caseItem);
          } else {
            toast({
              title: "Error",
              description: "Case not found",
              variant: "destructive",
            });
            navigate('/cases');
          }
        } 
        // If creating a new case with a client ID
        else if (searchParams.get('new') === 'true') {
          setIsCreating(true);
        }
      } catch (error) {
        console.error("Error fetching cases:", error);
        toast({
          title: "Error",
          description: "Failed to load cases. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast, searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCases = cases.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setIsCreating(false);
    setIsEditing(false);
    navigate(`/cases/${caseItem.id}`);
  };

  const handleCreateNew = () => {
    setSelectedCase(null);
    setIsCreating(true);
    setIsEditing(false);
    navigate(`/cases/create${clientIdFromURL ? `?clientId=${clientIdFromURL}` : ''}`);
  };

  const handleEditCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setIsEditing(true);
    navigate(`/cases/${caseItem.id}/edit`);
  };

  const handleCancelEdit = () => {
    if (selectedCase) {
      setIsEditing(false);
      navigate(`/cases/${selectedCase.id}`);
    } else {
      setIsCreating(false);
      navigate('/cases');
    }
  };

  const handleCaseFormSubmit = async (data: any) => {
    try {
      if (isEditing && selectedCase) {
        // Update existing case
        const updatedCase = await casesApi.updateCase(selectedCase.id, data);
        if (updatedCase) {
          toast({
            title: "Success",
            description: "Case updated successfully",
          });
          
          // Update cases list
          setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
          setSelectedCase(updatedCase);
          setIsEditing(false);
          navigate(`/cases/${updatedCase.id}`);
        }
      } else {
        // Create new case
        const newCase = await casesApi.createCase(data);
        if (newCase) {
          toast({
            title: "Success",
            description: "Case created successfully",
          });
          
          // Add to cases list
          setCases([...cases, newCase]);
          setSelectedCase(newCase);
          setIsCreating(false);
          navigate(`/cases/${newCase.id}`);
        }
      }
    } catch (error) {
      console.error("Error saving case:", error);
      toast({
        title: "Error",
        description: "Failed to save case. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBackToList = () => {
    setSelectedCase(null);
    setIsCreating(false);
    setIsEditing(false);
    navigate('/cases');
  };

  // Content for different views
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (isCreating) {
      return (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Create New Case</h2>
          <CaseForm
            initialData={null}
            clientId={clientIdFromURL || undefined}
            onSubmit={handleCaseFormSubmit}
            onCancel={handleCancelEdit}
          />
        </div>
      );
    }

    if (isEditing && selectedCase) {
      return (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Edit Case</h2>
          <CaseForm
            initialData={selectedCase}
            onSubmit={handleCaseFormSubmit}
            onCancel={handleCancelEdit}
          />
        </div>
      );
    }

    if (selectedCase) {
      // Find the client for this case
      const client = clients.find((c) => c.id === selectedCase.clientId);
      
      return (
        <CaseDetails 
          caseItem={selectedCase} 
          client={client}
          onBack={handleBackToList}
          onEdit={() => handleEditCase(selectedCase)}
        />
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button onClick={handleCreateNew} className="gap-1 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            New Case
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All Cases</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <CaseList 
              cases={filteredCases}
              clients={clients} 
              onSelectCase={handleSelectCase}
            />
          </TabsContent>
          
          <TabsContent value="open">
            <CaseList 
              cases={filteredCases.filter(c => c.status === 'open')}
              clients={clients} 
              onSelectCase={handleSelectCase}
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <CaseList 
              cases={filteredCases.filter(c => c.status === 'pending')}
              clients={clients} 
              onSelectCase={handleSelectCase}
            />
          </TabsContent>
          
          <TabsContent value="closed">
            <CaseList 
              cases={filteredCases.filter(c => c.status === 'closed' || c.status === 'settled')}
              clients={clients} 
              onSelectCase={handleSelectCase}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return renderContent();
};

export default CaseManagement;
