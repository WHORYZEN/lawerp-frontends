
import { useState } from "react";
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

type LorFormData = {
  id?: string;
  client_id: string;
  client_name?: string;
  case_id: string;
  referred_to: string;
  referral_reason: string;
  date_issued: string;
  physician_name: string;
  status: "Draft" | "Sent" | "Acknowledged";
  document_url: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
};

type LorDocumentFormProps = {
  initialData?: LorFormData | null;
  onSubmit: (data: LorFormData) => void;
  onCancel: () => void;
};

const LorDocumentForm = ({ initialData, onSubmit, onCancel }: LorDocumentFormProps) => {
  const [formData, setFormData] = useState<LorFormData>(
    initialData || {
      client_id: "",
      case_id: "",
      referred_to: "",
      referral_reason: "",
      date_issued: new Date().toISOString().split("T")[0],
      physician_name: "",
      status: "Draft",
      document_url: "",
      notes: "",
    }
  );

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      setFormData({ ...formData, date_issued: format(date, "yyyy-MM-dd") });
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
            <Label htmlFor="referred_to">Referred To</Label>
            <Input
              id="referred_to"
              name="referred_to"
              value={formData.referred_to}
              onChange={handleChange}
              placeholder="Specialist/Facility name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_issued">Date Issued</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date_issued && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date_issued ? format(new Date(formData.date_issued), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date_issued ? new Date(formData.date_issued) : undefined}
                  onSelect={handleDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="physician_name">Physician Name</Label>
            <Input
              id="physician_name"
              name="physician_name"
              value={formData.physician_name}
              onChange={handleChange}
              placeholder="Referring physician"
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
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Acknowledged">Acknowledged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="referral_reason">Referral Reason</Label>
            <Textarea
              id="referral_reason"
              name="referral_reason"
              value={formData.referral_reason}
              onChange={handleChange}
              placeholder="Short reason for referral"
              rows={2}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="document_url">Document Upload</Label>
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
              placeholder="Additional context"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update" : "Add"} Document
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LorDocumentForm;
