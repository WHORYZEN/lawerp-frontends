
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import BillingTable from "../client-billing/BillingTable";
import LienCalculator from "../calculator/LienCalculator";
import ClientAnalyticsChart from "./ClientAnalyticsChart";
import { clientsApi } from "@/lib/api/mongodb-api";
import { Client } from "@/types/client";
import { useToast } from "@/hooks/use-toast";

const DashboardOverview = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const fetchedClients = await clientsApi.getClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        toast({
          title: "Error",
          description: "Failed to load client data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Client Billings</h1>
          <p className="text-muted-foreground mt-1">
            Manage client billing, view analytics, and access important documents.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full md:w-auto gap-2"
          onClick={() => setShowCalculator(!showCalculator)}
        >
          {showCalculator ? "Hide" : "Show"} AT Lien Reduction Calculator
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showCalculator ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Client Analytics Chart */}
      <ClientAnalyticsChart data={clients} loading={loading} />

      {showCalculator && (
        <Card>
          <CardContent className="p-6">
            <LienCalculator />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="billings">
        <TabsList className="mb-4">
          <TabsTrigger value="billings">Billings</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="billings">
          <BillingTable />
        </TabsContent>
        <TabsContent value="clients">
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8 text-muted-foreground">
                Client management section would appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8 text-muted-foreground">
                Document management section would appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8 text-muted-foreground">
                Reports section would appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardOverview;
