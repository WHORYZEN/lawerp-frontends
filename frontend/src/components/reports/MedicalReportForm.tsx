
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MedicalReport } from "./MedicalReportsSheet";

// Define form schema for medical report
const formSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  case_id: z.string().min(1, "Case ID is required"),
  client_name: z.string().min(1, "Client name is required"),
  provider_name: z.string().min(1, "Provider name is required"),
  document_type: z.enum(["LOP", "Bill", "Records", "Other"], {
    required_error: "Document type is required",
  }),
  visit_date: z.string().min(1, "Visit date is required"),
  document_url: z.string().min(1, "Document URL is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MedicalReportFormProps {
  initialData: MedicalReport | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const MedicalReportForm = ({
  initialData,
  onSubmit,
  onCancel,
}: MedicalReportFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          client_id: initialData.client_id,
          case_id: initialData.case_id,
          client_name: initialData.client_name || "",
          provider_name: initialData.provider_name,
          document_type: initialData.document_type,
          visit_date: initialData.visit_date,
          document_url: initialData.document_url,
          notes: initialData.notes || "",
        }
      : {
          client_id: "",
          case_id: "",
          client_name: "",
          provider_name: "",
          document_type: "Records",
          visit_date: new Date().toISOString().split("T")[0],
          document_url: "",
          notes: "",
        },
  });

  const handleFormSubmit = (data: FormData) => {
    if (initialData) {
      // Edit mode
      onSubmit({
        ...initialData,
        ...data,
      });
    } else {
      // Add mode
      onSubmit(data);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Medical Report" : "Add New Medical Report"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Client ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="case_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Case-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="provider_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider Name</FormLabel>
                    <FormControl>
                      <Input placeholder="St. Mary's Hospital" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOP">LOP</SelectItem>
                        <SelectItem value="Bill">Bill</SelectItem>
                        <SelectItem value="Records">Records</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visit_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visit Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/document.pdf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional details about the medical report..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">{initialData ? "Update" : "Submit"}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MedicalReportForm;
