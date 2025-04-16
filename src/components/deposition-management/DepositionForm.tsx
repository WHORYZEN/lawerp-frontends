
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Deposition, DepositionFormData, DepositionStatus } from "@/types/deposition";
import { depositionsApi } from "@/lib/api/depositions-api";
import { Calendar as CalendarIcon, Clock, MapPin, User, Briefcase, FileText } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Validation schema
const formSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  caseId: z.string().min(1, "Case is required"),
  attorneyId: z.string().min(1, "Attorney is required"),
  attorneyName: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  location: z.string().optional(),
  status: z.enum(["scheduled", "completed", "rescheduled", "cancelled"]),
  notes: z.string().optional(),
  documentLink: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const DepositionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Initialize form with default values or existing deposition data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      caseId: "",
      attorneyId: "",
      attorneyName: "",
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      location: "",
      status: "scheduled" as DepositionStatus,
      notes: "",
      documentLink: "",
    },
  });

  // Load existing deposition data if editing
  useState(() => {
    if (id) {
      setIsLoading(true);
      depositionsApi.getDeposition(id)
        .then((deposition) => {
          if (deposition) {
            // Set form values from deposition
            form.reset({
              clientId: deposition.clientId,
              caseId: deposition.caseId,
              attorneyId: deposition.attorneyId,
              attorneyName: deposition.attorneyName,
              title: deposition.title,
              description: deposition.description || "",
              date: deposition.date,
              location: deposition.location || "",
              status: deposition.status,
              notes: deposition.notes || "",
              documentLink: deposition.documentLink || "",
            });
            setSelectedDate(new Date(deposition.date));
          }
        })
        .catch((error) => {
          console.error("Error loading deposition:", error);
          toast({
            title: "Error",
            description: "Failed to load deposition data",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      if (id) {
        // Update existing deposition
        await depositionsApi.updateDeposition(id, values as DepositionFormData);
        toast({
          title: "Success",
          description: "Deposition updated successfully",
        });
      } else {
        // Create new deposition
        await depositionsApi.createDeposition(values as DepositionFormData);
        toast({
          title: "Success",
          description: "Deposition created successfully",
        });
      }
      navigate("/depositions");
    } catch (error) {
      console.error("Error saving deposition:", error);
      toast({
        title: "Error",
        description: "Failed to save deposition",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for dropdowns (in a real app, these would come from APIs)
  const mockClients = [
    { id: "c1", name: "John Doe" },
    { id: "c2", name: "Jane Smith" },
    { id: "c3", name: "Bob Johnson" },
  ];

  const mockCases = [
    { id: "case1", name: "Car Accident - Doe v. Smith" },
    { id: "case2", name: "Slip & Fall - Smith v. Market" },
    { id: "case3", name: "Medical Malpractice - Johnson v. Hospital" },
  ];

  const mockAttorneys = [
    { id: "a1", name: "Sarah McCoy" },
    { id: "a2", name: "Dan Lee" },
    { id: "a3", name: "Jessica Miller" },
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? "Edit Deposition" : "Create New Deposition"}</CardTitle>
        <CardDescription>
          {id ? "Update deposition details" : "Enter deposition information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Deposition title" {...field} />
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
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rescheduled">Rescheduled</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="caseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select case" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCases.map((case_) => (
                          <SelectItem key={case_.id} value={case_.id}>
                            {case_.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attorneyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attorney</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Set attorney name when attorney is selected
                        const attorney = mockAttorneys.find((a) => a.id === value);
                        if (attorney) {
                          form.setValue("attorneyName", attorney.name);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select attorney" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockAttorneys.map((attorney) => (
                          <SelectItem key={attorney.id} value={attorney.id}>
                            {attorney.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP p")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            if (date) {
                              setSelectedDate(date);
                              const currentTime = field.value 
                                ? new Date(field.value) 
                                : new Date();
                              date.setHours(currentTime.getHours());
                              date.setMinutes(currentTime.getMinutes());
                              field.onChange(date.toISOString());
                            }
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <Input 
                            type="time"
                            value={field.value ? format(new Date(field.value), "HH:mm") : ""}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':').map(Number);
                              const date = selectedDate || new Date();
                              date.setHours(hours);
                              date.setMinutes(minutes);
                              field.onChange(date.toISOString());
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Deposition location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a description of the deposition"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes for preparation"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Link to related document" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/depositions')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : id ? "Update Deposition" : "Create Deposition"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DepositionForm;
