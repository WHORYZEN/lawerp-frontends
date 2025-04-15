
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, PieChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Cell, Pie } from "recharts";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data for client billing analytics
const clientGrowthData = [
  { month: "Jan", clients: 65, revenue: 24400 },
  { month: "Feb", clients: 59, revenue: 22100 },
  { month: "Mar", clients: 80, revenue: 28000 },
  { month: "Apr", clients: 81, revenue: 29000 },
  { month: "May", clients: 56, revenue: 21800 },
  { month: "Jun", clients: 55, revenue: 19900 },
  { month: "Jul", clients: 40, revenue: 18100 },
  { month: "Aug", clients: 70, revenue: 24300 },
  { month: "Sep", clients: 90, revenue: 32100 },
  { month: "Oct", clients: 95, revenue: 35000 },
  { month: "Nov", clients: 85, revenue: 31000 },
  { month: "Dec", clients: 100, revenue: 38000 },
];

const clientTypeData = [
  { name: "Corporate", value: 35, color: "#8B5CF6" },
  { name: "Individual", value: 45, color: "#D946EF" },
  { name: "Insurance", value: 20, color: "#F97316" },
];

const ClientAnalyticsChart = () => {
  const [chartType, setChartType] = useState<"growth" | "distribution">("growth");
  const [timeframe, setTimeframe] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const { toast } = useToast();

  const handleExportData = () => {
    toast({
      title: "Export started",
      description: "Your analytics data is being prepared for download.",
    });
    
    // In a real application, this would trigger an API call to generate a report
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Analytics data has been exported successfully.",
      });
    }, 1500);
  };

  const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#1EAEDB"];

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client Analytics</CardTitle>
        <div className="flex gap-2">
          <Tabs defaultValue="monthly" className="w-auto" onValueChange={(value) => setTimeframe(value as any)}>
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExportData}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="growth" className="w-full" onValueChange={(value) => setChartType(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="growth">Client Growth</TabsTrigger>
            <TabsTrigger value="distribution">Client Distribution</TabsTrigger>
          </TabsList>
          <TabsContent value="growth">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clientGrowthData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clients" fill="#8B5CF6" name="Total Clients" />
                  <Line type="monotone" dataKey="revenue" stroke="#D946EF" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="distribution">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clientTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {clientTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientAnalyticsChart;
