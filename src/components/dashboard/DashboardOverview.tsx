
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import BillingTable from "../client-billing/BillingTable";
import LienCalculator from "../calculator/LienCalculator";

const DashboardOverview = () => {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Client Billings</h1>
          <p className="text-muted-foreground mt-1">
            Anybody clicks on home page menu — same items appear here: Clients, Billing, Documents, Reports, and AT Lien Reduction Calculator.
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
