
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

// Mock data for client dropdown
const mockClients = [
  { id: "c1", name: "John Doe" },
  { id: "c2", name: "Jane Smith" },
  { id: "c3", name: "Robert Johnson" },
];

// Mock data for case dropdown
const mockCases = [
  { id: "case1", name: "Accident Claim 123" },
  { id: "case2", name: "Insurance Dispute 456" },
  { id: "case3", name: "Personal Injury 789" },
];

type BillFormData = {
  id?: string;
  client_id: string;
  client_name?: string;
  case_id: string;
  provider_name: string;
  date_of_service: string;
  billed_amount: number;
  covered_amount: number;
  balance_due: number;
  status: "Pending" | "Paid" | "Disputed" | "Approved";
  document_url: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
};

type BillsFormProps = {
  initialData?: BillFormData | null;
  onSubmit: (data: BillFormData) => void;
  onCancel: () => void;
};

const BillsForm = ({ initialData, onSubmit, onCancel }: BillsFormProps) => {
  const [formData, setFormData] = useState<BillFormData>(
    initialData || {
      client_id: "",
      case_id: "",
      provider_name: "",
      date_of_service: new Date().toISOString().split("T")[0],
      billed_amount: 0,
      covered_amount: 0,
      balance_due: 0,
      status: "Pending",
      document_url: "",
      notes: "",
    }
  );

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  // Calculate balance due whenever billed amount or covered amount changes
  useEffect(() => {
    const balanceDue = formData.billed_amount - formData.covered_amount;
    setFormData(prev => ({ ...prev, balance_due: balanceDue >= 0 ? balanceDue : 0 }));
  }, [formData.billed_amount, formData.covered_amount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric input for amounts
    if (name === 'billed_amount' || name === 'covered_amount') {
      // Parse as float, default to 0 if NaN
      const numValue = parseFloat(value) || 0;
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });

    // If client_id changes, set client_name for display purposes
    if (name === "client_id") {
      const selectedClient = mockClients.find(c => c.id === value);
      if (selectedClient) {
        setFormData(prev => ({ ...prev, client_id: value, client_name: selectedClient.name }));
      }
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date_of_service: format(date, "yyyy-MM-dd") });
      setDatePickerOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-2">
      <div className="space-y-4 bg-white rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client_id">Client</Label>
            <Select 
              value={formData.client_id} 
              onValueChange={(value) => handleSelectChange("client_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_id">Case</Label>
            <Select 
              value={formData.case_id} 
              onValueChange={(value) => handleSelectChange("case_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a case" />
              </SelectTrigger>
              <SelectContent>
                {mockCases.map((case_) => (
                  <SelectItem key={case_.id} value={case_.id}>
                    {case_.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider_name">Provider Name</Label>
            <Input
              id="provider_name"
              name="provider_name"
              value={formData.provider_name}
              onChange={handleChange}
              placeholder="Billing provider"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_service">Date of Service</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date_of_service && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date_of_service ? format(new Date(formData.date_of_service), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date_of_service ? new Date(formData.date_of_service) : undefined}
                  onSelect={handleDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billed_amount">Billed Amount</Label>
            <Input
              id="billed_amount"
              name="billed_amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.billed_amount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="covered_amount">Covered Amount</Label>
            <Input
              id="covered_amount"
              name="covered_amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.covered_amount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance_due">Balance Due</Label>
            <Input
              id="balance_due"
              value={formData.balance_due.toFixed(2)}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange("status", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Disputed">Disputed</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="document_url">Bill Document</Label>
            <Input
              id="document_url"
              name="document_url"
              type="file"
              onChange={(e) => {
                // In a real app, this would upload to server and get URL back
                if (e.target.files && e.target.files[0]) {
                  setFormData({
                    ...formData,
                    document_url: URL.createObjectURL(e.target.files[0]),
                  });
                }
              }}
            />
            {formData.document_url && <p className="text-sm text-muted-foreground">Current file: {formData.document_url.split("/").pop()}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update" : "Add"} Medical Bill
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BillsForm;
