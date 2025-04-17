
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
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  ClipboardList,
  Calendar,
  DollarSign
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MedicalRecord, 
  Provider 
} from '@/types/medical';
import { medicalApi } from '@/backend';

const MedicalRecordsManagement: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<MedicalRecord | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>>({
    caseId: '',
    clientId: '',
    providerId: '',
    providerName: '',
    recordType: 'visit',
    title: '',
    description: '',
    date: new Date().toISOString(),
    documentIds: [],
    amount: 0,
    paid: false,
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedRecords, fetchedProviders] = await Promise.all([
          medicalApi.getMedicalRecords(),
          medicalApi.getProviders()
        ]);
        
        setRecords(fetchedRecords);
        setProviders(fetchedProviders);
      } catch (error) {
        console.error('Error fetching medical records:', error);
        toast({
          title: "Error",
          description: "Failed to load medical records. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      // If provider name isn't already set, get it from the providers list
      let updatedFormData = { ...formData };
      if (!updatedFormData.providerName && updatedFormData.providerId) {
        const provider = providers.find(p => p.id === updatedFormData.providerId);
        if (provider) {
          updatedFormData.providerName = provider.name;
        }
      }
      
      const newRecord = await medicalApi.createMedicalRecord(updatedFormData);
      setRecords([...records, newRecord]);
      setShowForm(false);
      resetForm();
      toast({
        title: "Medical Record Added",
        description: "The medical record has been successfully added."
      });
    } catch (error) {
      console.error('Error creating medical record:', error);
      toast({
        title: "Error",
        description: "Failed to add medical record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!recordToEdit) return;
    
    try {
      // If provider name isn't already set, get it from the providers list
      let updatedFormData = { ...formData };
      if (!updatedFormData.providerName && updatedFormData.providerId) {
        const provider = providers.find(p => p.id === updatedFormData.providerId);
        if (provider) {
          updatedFormData.providerName = provider.name;
        }
      }
      
      const updatedRecord = await medicalApi.updateMedicalRecord(recordToEdit.id, updatedFormData);
      if (updatedRecord) {
        setRecords(records.map(record => 
          record.id === updatedRecord.id ? updatedRecord : record
        ));
        setRecordToEdit(null);
        resetForm();
        toast({
          title: "Medical Record Updated",
          description: "The medical record has been successfully updated."
        });
      }
    } catch (error) {
      console.error('Error updating medical record:', error);
      toast({
        title: "Error",
        description: "Failed to update medical record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await medicalApi.deleteMedicalRecord(id);
      if (success) {
        setRecords(records.filter(record => record.id !== id));
        toast({
          title: "Medical Record Deleted",
          description: "The medical record has been successfully deleted."
        });
      }
    } catch (error) {
      console.error('Error deleting medical record:', error);
      toast({
        title: "Error",
        description: "Failed to delete medical record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      caseId: '',
      clientId: '',
      providerId: '',
      providerName: '',
      recordType: 'visit',
      title: '',
      description: '',
      date: new Date().toISOString(),
      documentIds: [],
      amount: 0,
      paid: false,
      notes: ''
    });
  };

  const openEditForm = (record: MedicalRecord) => {
    setRecordToEdit(record);
    setFormData({
      caseId: record.caseId,
      clientId: record.clientId,
      providerId: record.providerId,
      providerName: record.providerName || '',
      recordType: record.recordType,
      title: record.title,
      description: record.description || '',
      date: record.date,
      documentIds: record.documentIds || [],
      amount: record.amount || 0,
      paid: record.paid || false,
      paidBy: record.paidBy,
      notes: record.notes || ''
    });
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'treatment':
        return <ClipboardList className="h-4 w-4 text-green-600" />;
      case 'test':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'prescription':
        return <FileText className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  // Mock client data for demo
  const clients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Robert Johnson' }
  ];

  // Mock case data for demo
  const cases = [
    { id: 'case-001', name: 'Auto Accident - John Doe' },
    { id: 'case-002', name: 'Workplace Injury - Jane Smith' },
    { id: 'case-003', name: 'Slip and Fall - Robert Johnson' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search medical records..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Medical Record
        </Button>
      </div>

      <Dialog open={showForm || !!recordToEdit} onOpenChange={(open) => {
        if (!open) {
          setShowForm(false);
          setRecordToEdit(null);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{recordToEdit ? 'Edit Medical Record' : 'Add New Medical Record'}</DialogTitle>
            <DialogDescription>
              {recordToEdit 
                ? 'Update the medical record information'
                : 'Enter the details of the medical record'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="caseId" className="text-right">
                Case
              </Label>
              <Select
                value={formData.caseId}
                onValueChange={(value) => setFormData({...formData, caseId: value})}
              >
                <SelectTrigger id="caseId" className="col-span-3">
                  <SelectValue placeholder="Select a case" />
                </SelectTrigger>
                <SelectContent>
                  {cases.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientId" className="text-right">
                Client
              </Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({...formData, clientId: value})}
              >
                <SelectTrigger id="clientId" className="col-span-3">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="providerId" className="text-right">
                Provider
              </Label>
              <Select
                value={formData.providerId}
                onValueChange={(value) => {
                  const provider = providers.find(p => p.id === value);
                  setFormData({
                    ...formData, 
                    providerId: value,
                    providerName: provider ? provider.name : ''
                  });
                }}
              >
                <SelectTrigger id="providerId" className="col-span-3">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recordType" className="text-right">
                Record Type
              </Label>
              <Select
                value={formData.recordType}
                onValueChange={(value: any) => setFormData({...formData, recordType: value})}
              >
                <SelectTrigger id="recordType" className="col-span-3">
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visit">Visit</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="discharge">Discharge</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, date: new Date(e.target.value).toISOString()})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Label htmlFor="paid">Payment Status</Label>
              </div>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox 
                  id="paid" 
                  checked={formData.paid} 
                  onCheckedChange={(checked) => 
                    setFormData({...formData, paid: checked as boolean})
                  }
                />
                <label
                  htmlFor="paid"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Bill has been paid
                </label>
              </div>
            </div>
            {formData.paid && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paidBy" className="text-right">
                  Paid By
                </Label>
                <Select
                  value={formData.paidBy}
                  onValueChange={(value: any) => setFormData({...formData, paidBy: value})}
                >
                  <SelectTrigger id="paidBy" className="col-span-3">
                    <SelectValue placeholder="Select who paid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="firm">Law Firm</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
            <Button onClick={recordToEdit ? handleUpdate : handleCreate}>
              {recordToEdit ? 'Update Record' : 'Add Record'}
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
          {filteredRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Record</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[150px]">Provider</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Amount</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="font-medium flex items-center gap-2">
                        {getRecordTypeIcon(record.recordType)}
                        {record.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Case: {cases.find(c => c.id === record.caseId)?.name || record.caseId}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {record.providerName}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {record.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>${record.amount?.toFixed(2) || '0.00'}</span>
                        <Badge variant={record.paid ? "success" : "outline"} className="mt-1 text-xs">
                          {record.paid ? (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              Paid
                              {record.paidBy && ` (${record.paidBy})`}
                            </span>
                          ) : 'Unpaid'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(record.id)}
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
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">No Medical Records Found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Add your first medical record to get started"
                }
              </p>
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};

export default MedicalRecordsManagement;
