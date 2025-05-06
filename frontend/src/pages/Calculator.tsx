
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LienCalculator from "@/components/calculator/LienCalculator";
import AiLienCalculator from "@/components/calculator/AiLienCalculator";
import EmailProcessor from "@/components/calculator/EmailProcessor";

const Calculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("ai");
  const [showEmailProcessor, setShowEmailProcessor] = useState(false);
  const [processingEmailBill, setProcessingEmailBill] = useState(false);

  const handleProcessBill = (billData: any) => {
    // Switch to AI tab to process the bill
    setActiveTab("ai");
    setProcessingEmailBill(true);
    
    // Automatically close email processor after processing
    setShowEmailProcessor(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="pt-16 md:pl-64">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Lien Reduction Calculators</h1>
              <button 
                onClick={() => setShowEmailProcessor(!showEmailProcessor)}
                className={`text-sm px-4 py-2 rounded-md flex items-center gap-2 ${
                  showEmailProcessor 
                    ? 'bg-gray-200 text-gray-700' 
                    : 'bg-lawfirm-light-blue text-white'
                }`}
              >
                {showEmailProcessor ? 'Hide Email Processor' : 'Process Email Bills'}
              </button>
            </div>
            <p className="text-muted-foreground mt-1">
              Calculate potential lien reductions for personal injury cases
            </p>
          </div>
          
          {showEmailProcessor && (
            <div className="mb-6">
              <EmailProcessor onProcessBill={handleProcessBill} />
            </div>
          )}
          
          <div className="max-w-4xl mx-auto">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full mb-6"
            >
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="ai">AI Lien Calculator</TabsTrigger>
                <TabsTrigger value="manual">Manual Calculator</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai" className="pt-6">
                <AiLienCalculator autoProcess={processingEmailBill} />
              </TabsContent>
              
              <TabsContent value="manual" className="pt-6">
                <LienCalculator />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="md:pl-64 px-4 py-6 border-t text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">LYZ Law Firm</span> | Calculator
          </div>
          <div className="text-sm">© 2023 LYZ Law Firm. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;
