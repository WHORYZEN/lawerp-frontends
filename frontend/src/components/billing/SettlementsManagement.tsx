
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Settlement } from '@/backend/billing-api';
import { billingApi } from '@/backend';
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Download, FileText, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const SettlementsManagement: React.FC = () => {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [caseId, setCaseId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [attorneyFees, setAttorneyFees] = useState('');
  const [medicalLiens, setMedicalLiens] = useState('');
  const [expenses, setExpenses] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettlements = async () => {
      setIsLoading(true);
      try {
        const fetchedSettlements = await billingApi.getSettlements();
        setSettlements(fetchedSettlements);
      } catch (error) {
        console.error('Error fetching settlements:', error);
        toast({
          title: "Error",
          description: "Failed to load settlements. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettlements();
  }, [toast]);

  const calculateClientAmount = () => {
    const total = parseFloat(totalAmount) || 0;
    const fees = parseFloat(attorneyFees) || 0;
    const liens = parseFloat(medicalLiens) || 0;
    const exp = parseFloat(expenses) || 0;
    
    return Math.max(0, total - fees - liens - exp);
  };

  const resetForm = () => {
    setClientId('');
    setCaseId('');
    setTotalAmount('');
    setAttorneyFees('');
    setMedicalLiens('');
    setExpenses('');
  };

  const validateForm = () => {
    if (!clientId || !caseId || !totalAmount || !attorneyFees) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    // Ensure calculated client amount is not negative
    if (calculateClientAmount() < 0) {
      toast({
        title: "Validation Error",
        description: "Client's amount cannot be negative. Check your calculations.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateSettlement = async () => {
    if (!validateForm()) return;

    try {
      const newSettlement = await billingApi.createSettlement({
        clientId,
        caseId,
        totalAmount: parseFloat(totalAmount),
        clientAmount: calculateClientAmount(),
        attorneyFees: parseFloat(attorneyFees),
        medicalLiens: parseFloat(medicalLiens) || 0,
        expenses: parseFloat(expenses) || 0,
        status: 'proposed'
      });
      
      setSettlements(prev => [...prev, newSettlement]);
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Settlement proposal created successfully.",
      });
    } catch (error) {
      console.error('Error creating settlement:', error);
      toast({
        title: "Error",
        description: "Failed to create settlement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFinalizeSettlement = async (id: string) => {
    try {
      const updatedSettlement = await billingApi.finalizeSettlement(id);
      if (updatedSettlement) {
        setSettlements(prev => prev.map(settlement => settlement.id === id ? updatedSettlement : settlement));
        toast({
          title: "Success",
          description: "Settlement has been finalized.",
        });
      }
    } catch (error) {
      console.error('Error finalizing settlement:', error);
      toast({
        title: "Error",
        description: "Failed to finalize settlement. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mock clients and cases for demo
  const mockClients = [
    { id: 'client1', name: 'John Client' },
    { id: 'client2', name: 'Sarah Patient' },
    { id: 'client3', name: 'Michael Case' },
  ];

  const mockCases = [
    { id: 'case1', name: 'Personal Injury - Car Accident' },
    { id: 'case2', name: 'Medical Malpractice Claim' },
    { id: 'case3', name: 'Workers Compensation Claim' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Settlements Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Settlement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Settlement Proposal</DialogTitle>
              <DialogDescription>
                Create a new settlement proposal for a client case
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="case">Case</Label>
                <Select value={caseId} onValueChange={setCaseId}>
                  <SelectTrigger id="case">
                    <SelectValue placeholder="Select case" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCases.map(caseItem => (
                      <SelectItem key={caseItem.id} value={caseItem.id}>{caseItem.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="totalAmount">Total Settlement Amount ($)</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="e.g. 50000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="attorneyFees">Attorney Fees ($)</Label>
                <Input
                  id="attorneyFees"
                  type="number"
                  min="0"
                  step="0.01"
                  value={attorneyFees}
                  onChange={(e) => setAttorneyFees(e.target.value)}
                  placeholder="e.g. 15000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="medicalLiens">Medical Liens ($)</Label>
                <Input
                  id="medicalLiens"
                  type="number"
                  min="0"
                  step="0.01"
                  value={medicalLiens}
                  onChange={(e) => setMedicalLiens(e.target.value)}
                  placeholder="e.g. 5000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expenses">Expenses ($)</Label>
                <Input
                  id="expenses"
                  type="number"
                  min="0"
                  step="0.01"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  placeholder="e.g. 1000"
                />
              </div>
              <div className="mt-2 pt-2 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold">Client's Amount:</span>
                  <span className="font-semibold">${calculateClientAmount().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleCreateSettlement}>
                Create Settlement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-[250px]" />
                <Skeleton className="h-4 w-[400px]" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Case</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Client Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No settlements found. Create a new settlement to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  settlements.map(settlement => (
                    <TableRow key={settlement.id}>
                      <TableCell className="font-medium">S-{settlement.id.slice(0, 6).toUpperCase()}</TableCell>
                      <TableCell>
                        {mockClients.find(c => c.id === settlement.clientId)?.name || settlement.clientId}
                      </TableCell>
                      <TableCell>
                        {mockCases.find(c => c.id === settlement.caseId)?.name || settlement.caseId}
                      </TableCell>
                      <TableCell>${settlement.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>${settlement.clientAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={
                          settlement.status === 'finalized' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          settlement.status === 'accepted' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                          settlement.status === 'proposed' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' :
                          settlement.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                          'bg-gray-100 text-gray-800 hover:bg-gray-100'
                        }>
                          {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          {(settlement.status === 'accepted' || settlement.status === 'proposed') && (
                            <Button variant="ghost" size="icon" onClick={() => handleFinalizeSettlement(settlement.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default SettlementsManagement;
