
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MedicalReportsSheet from "./MedicalReportsSheet";
import ReductionStatementsSheet from "./ReductionStatementsSheet";

const ReportsManagement = () => {
  const [activeTab, setActiveTab] = useState("medical");

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b px-6 py-2">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="medical">Medical Reports</TabsTrigger>
            <TabsTrigger value="reduction">Reduction Statements</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="medical" className="p-6 space-y-4">
          <MedicalReportsSheet />
        </TabsContent>
        
        <TabsContent value="reduction" className="p-6 space-y-4">
          <ReductionStatementsSheet />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;
