
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReductionStatement } from "./ReductionStatementsSheet";

// Define form schema for reduction statement
const formSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  case_id: z.string().min(1, "Case ID is required"),
  client_name: z.string().min(1, "Client name is required"),
  provider_name: z.string().min(1, "Provider name is required"),
  original_amount: z.coerce.number().positive("Amount must be positive"),
  ai_reduction_suggestion: z.coerce.number().positive("Amount must be positive"),
  reduction_reasoning: z.string().min(1, "Reasoning is required"),
  status: z.enum(["Pending", "Approved", "Sent to Provider"]),
  document_url: z.string().min(1, "Document URL is required"),
});

type FormData = z.infer<typeof formSchema>;

interface ReductionStatementFormProps {
  initialData: ReductionStatement | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ReductionStatementForm = ({
  initialData,
  onSubmit,
  onCancel,
}: ReductionStatementFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          client_id: initialData.client_id,
          case_id: initialData.case_id,
          client_name: initialData.client_name || "",
          provider_name: initialData.provider_name,
          original_amount: initialData.original_amount,
          ai_reduction_suggestion: initialData.ai_reduction_suggestion,
          reduction_reasoning: initialData.reduction_reasoning,
          status: initialData.status,
          document_url: initialData.document_url,
        }
      : {
          client_id: "",
          case_id: "",
          client_name: "",
          provider_name: "",
          original_amount: 0,
          ai_reduction_suggestion: 0,
          reduction_reasoning: "",
          status: "Pending",
          document_url: "",
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
        <CardTitle>
          {initialData ? "Edit Reduction Statement" : "Add New Reduction Statement"}
        </CardTitle>
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
                name="original_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ai_reduction_suggestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggested Reduction Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Sent to Provider">Sent to Provider</SelectItem>
                      </SelectContent>
                    </Select>
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
                name="reduction_reasoning"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Reduction Reasoning</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain the rationale for the reduction..."
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

export default ReductionStatementForm;
