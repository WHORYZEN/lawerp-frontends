
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Hospital, 
  UserRound, 
  Building, 
  Pill, 
  Search, 
  Plus, 
  Edit, 
  Trash2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Provider, ProviderType } from '@/types/medical';
import { medicalApi } from '@/backend';

const ProviderManagement: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState<Provider | null>(null);
  const [providerTypes, setProviderTypes] = useState<ProviderType[]>([]);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    type: 'hospital',
    address: '',
    phone: '',
    email: '',
    contactPerson: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedProviders, fetchedTypes] = await Promise.all([
          medicalApi.getProviders(),
          medicalApi.getProviderTypes()
        ]);
        
        setProviders(fetchedProviders);
        setProviderTypes(fetchedTypes);
      } catch (error) {
        console.error('Error fetching provider data:', error);
        toast({
          title: "Error",
          description: "Failed to load providers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (provider.contactPerson && provider.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = async () => {
    try {
      const newProvider = await medicalApi.createProvider(formData);
      setProviders([...providers, newProvider]);
      setShowForm(false);
      resetForm();
      toast({
        title: "Provider Added",
        description: "The healthcare provider has been successfully added."
      });
    } catch (error) {
      console.error('Error creating provider:', error);
      toast({
        title: "Error",
        description: "Failed to add provider. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!providerToEdit) return;
    
    try {
      const updatedProvider = await medicalApi.updateProvider(providerToEdit.id, formData);
      if (updatedProvider) {
        setProviders(providers.map(provider => 
          provider.id === updatedProvider.id ? updatedProvider : provider
        ));
        setProviderToEdit(null);
        resetForm();
        toast({
          title: "Provider Updated",
          description: "The healthcare provider has been successfully updated."
        });
      }
    } catch (error) {
      console.error('Error updating provider:', error);
      toast({
        title: "Error",
        description: "Failed to update provider. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await medicalApi.deleteProvider(id);
      if (success) {
        setProviders(providers.filter(provider => provider.id !== id));
        toast({
          title: "Provider Deleted",
          description: "The healthcare provider has been successfully deleted."
        });
      }
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast({
        title: "Error",
        description: "Failed to delete provider. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'hospital',
      address: '',
      phone: '',
      email: '',
      contactPerson: '',
      notes: ''
    });
  };

  const openEditForm = (provider: Provider) => {
    setProviderToEdit(provider);
    setFormData({
      name: provider.name,
      type: provider.type,
      address: provider.address || '',
      phone: provider.phone || '',
      email: provider.email || '',
      contactPerson: provider.contactPerson || '',
      notes: provider.notes || ''
    });
  };

  const getProviderIcon = (type: ProviderType) => {
    switch (type) {
      case 'hospital':
        return <Hospital className="h-4 w-4 text-blue-600" />;
      case 'doctor':
        return <UserRound className="h-4 w-4 text-green-600" />;
      case 'clinic':
        return <Building className="h-4 w-4 text-purple-600" />;
      case 'pharmacy':
        return <Pill className="h-4 w-4 text-red-600" />;
      default:
        return <Building className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search providers..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>

      <Dialog open={showForm || !!providerToEdit} onOpenChange={(open) => {
        if (!open) {
          setShowForm(false);
          setProviderToEdit(null);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{providerToEdit ? 'Edit Provider' : 'Add New Provider'}</DialogTitle>
            <DialogDescription>
              {providerToEdit 
                ? 'Update the healthcare provider information'
                : 'Enter the details of the healthcare provider'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({...formData, type: value as ProviderType})}
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
                <SelectContent>
                  {providerTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="col-span-3"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPerson" className="text-right">
                Contact Person
              </Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={providerToEdit ? handleUpdate : handleCreate}>
              {providerToEdit ? 'Update Provider' : 'Add Provider'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </Card>
          ))}
        </div>
      ) : (
        <ScrollArea className="h-[600px]">
          {filteredProviders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Name</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[180px]">Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getProviderIcon(provider.type)}
                        {provider.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {provider.type.charAt(0).toUpperCase() + provider.type.slice(1)}
                    </TableCell>
                    <TableCell>
                      <div>
                        {provider.contactPerson && (
                          <div className="text-sm">{provider.contactPerson}</div>
                        )}
                        {provider.phone && (
                          <div className="text-sm text-muted-foreground">{provider.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {provider.address}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(provider)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(provider.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 border rounded-md">
              <Building className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">No Providers Found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Add your first provider to get started"
                }
              </p>
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};

export default ProviderManagement;
