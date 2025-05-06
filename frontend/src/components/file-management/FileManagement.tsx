
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DependencyViewSheet from "./DependencyViewSheet";

const FileManagement = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get('tab') || 'dependency';
  
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(urlParams.get('tab') || 'dependency');
  }, [location.search]);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b px-6 py-2 overflow-x-auto">
          <TabsList className="grid w-full max-w-md grid-cols-1">
            <TabsTrigger value="dependency">Master Dependency View</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="dependency" className="p-6 space-y-4">
          <DependencyViewSheet />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileManagement;
