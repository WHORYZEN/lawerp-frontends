
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  Briefcase,
  FileText,
  Plus,
  Search,
  Filter,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DepositionList from "./DepositionList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DepositionStatus } from "@/types/deposition";

const DepositionManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const statusParam = params.get('status') as DepositionStatus | null;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState<string>(statusParam || "all");

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    if (value === "all") {
      navigate("/depositions");
    } else {
      navigate(`/depositions?status=${value}`);
    }
  };

  const handleCreateNew = () => {
    navigate("/depositions/create");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search depositions..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleCreateNew} className="gap-1">
            <Plus className="h-4 w-4" />
            New Deposition
          </Button>
        </div>
      </div>

      <Tabs defaultValue={currentTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rescheduled">Rescheduled</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value={currentTab}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Depositions</CardTitle>
              <CardDescription>
                Manage and organize your client depositions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DepositionList 
                searchQuery={searchQuery} 
                statusFilter={currentTab === "all" ? undefined : currentTab as DepositionStatus} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepositionManagement;
