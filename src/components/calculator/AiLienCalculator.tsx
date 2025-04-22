
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Calculator, Upload, Download, File, FileText } from "lucide-react";
import { useForm } from "react-hook-form";

// Mock data for the extracted bills
const mockExtractedBills = [
  { id: 1, provider: "City Hospital", description: "Emergency Room Visit", originalAmount: 8500, reducedAmount: 5950 },
  { id: 2, provider: "MRI Center", description: "MRI Scan - Lower Back", originalAmount: 3200, reducedAmount: 1920 },
  { id: 3, provider: "Dr. Smith", description: "Chiropractic Treatment (10 sessions)", originalAmount: 4500, reducedAmount: 2700 },
  { id: 4, provider: "Physical Therapy", description: "Rehabilitation (15 sessions)", originalAmount: 6300, reducedAmount: 3780 },
  { id: 5, provider: "Pharmacy", description: "Medication", originalAmount: 890, reducedAmount: 712 },
];

// Mock data for bills received via email
const mockEmailBills = [
  { id: 1, provider: "City Hospital", description: "Emergency Room Visit", originalAmount: 8500 },
  { id: 2, provider: "MRI Center", description: "MRI Scan", originalAmount: 3200 },
  { id: 3, provider: "Dr. Smith", description: "Consultation", originalAmount: 1500 },
];

interface AiLienCalculatorProps {
  autoProcess?: boolean;
}

const AiLienCalculator = ({ autoProcess = false }: AiLienCalculatorProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [extractedBills, setExtractedBills] = useState(mockExtractedBills);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isEmailBill, setIsEmailBill] = useState(false);
  
  const form = useForm({
    defaultValues: {
      settlementAmount: "",
      attorneyFees: "",
      caseExpenses: ""
    }
  });

  // Handle automatic processing from email
  useEffect(() => {
    if (autoProcess) {
      // Simulate processing email-sourced bill
      setIsEmailBill(true);
      setIsProcessing(true);
      
      // Convert email bills to the format we need
      const processedBills = mockEmailBills.map(bill => ({
        ...bill,
        id: bill.id,
        reducedAmount: Math.round(bill.originalAmount * 0.6) // 40% reduction
      }));
      
      setTimeout(() => {
        setExtractedBills(processedBills);
        setIsProcessing(false);
        setShowResults(true);
        
        toast({
          title: "Email Bill Processed",
          description: "The bill from your email has been automatically processed.",
        });
      }, 2000);
    }
  }, [autoProcess, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload process
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setIsProcessing(true);
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        setShowResults(true);
        
        toast({
          title: "Success",
          description: "PDF processed successfully. AI has calculated the reduced lien amounts.",
        });
      }, 2000);
    }, 1500);
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "The lien reduction report has been downloaded successfully."
    });
  };

  // Calculate totals
  const totalOriginal = extractedBills.reduce((sum, bill) => sum + bill.originalAmount, 0);
  const totalReduced = extractedBills.reduce((sum, bill) => sum + bill.reducedAmount, 0);
  const totalSavings = totalOriginal - totalReduced;
  const savingsPercentage = ((totalSavings / totalOriginal) * 100).toFixed(2);
  
  const PreviewDialog = () => (
    <>
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" /> Preview PDF
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80%]">
            <DrawerHeader>
              <DrawerTitle>PDF Preview</DrawerTitle>
              <DrawerDescription>Preview of the uploaded medical bill PDF</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 flex-1 overflow-auto">
              <div className="bg-gray-100 h-full rounded flex items-center justify-center">
                <div className="text-center">
                  <File className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">PDF preview would appear here</p>
                  <p className="text-xs text-gray-500">PDF.js integration required for actual preview</p>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2" 
            onClick={() => setPreviewOpen(true)}
          >
            <FileText className="h-4 w-4" /> Preview PDF
          </Button>
          <DialogContent className="max-w-3xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>PDF Preview</DialogTitle>
              <DialogDescription>Preview of the uploaded medical bill PDF</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              <div className="bg-gray-100 h-[60vh] rounded flex items-center justify-center">
                <div className="text-center">
                  <File className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">PDF preview would appear here</p>
                  <p className="text-xs text-gray-500">PDF.js integration required for actual preview</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );

  // When window resizes, update isMobile state
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-lawfirm-light-blue bg-opacity-10">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-lawfirm-light-blue" />
          <CardTitle className="text-lg font-medium">AI Lien Reduction Calculator</CardTitle>
        </div>
        <CardDescription>
          {isEmailBill 
            ? "Processing medical bill received from email" 
            : "Upload a PDF medical bill to calculate potential lien reductions"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          {isProcessing && (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 border-4 border-lawfirm-light-blue border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4">Processing medical bill...</p>
              <p className="text-sm text-gray-500">This might take a moment</p>
            </div>
          )}
          
          {!isProcessing && !showResults && !isEmailBill && (
            <>
              <div className="space-y-4">
                <Label htmlFor="pdf-upload">Upload Medical Bill PDF</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-center text-muted-foreground">
                      Drag and drop your PDF here, or click to browse
                    </p>
                    <Input 
                      id="pdf-upload" 
                      type="file" 
                      accept=".pdf" 
                      className="max-w-xs" 
                      onChange={handleFileChange}
                    />
                    {file && (
                      <div className="mt-2 text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-lawfirm-light-blue" />
                        <span>{file.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {file && <PreviewDialog />}

              <Form {...form}>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Optional Case Details</h3>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="settlementAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Settlement Amount</FormLabel>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                            <FormControl>
                              <Input
                                placeholder="0.00"
                                className="pl-7"
                                {...field}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="attorneyFees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Attorney Fees</FormLabel>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                              <FormControl>
                                <Input
                                  placeholder="0.00"
                                  className="pl-7"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="caseExpenses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Case Expenses</FormLabel>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                              <FormControl>
                                <Input
                                  placeholder="0.00"
                                  className="pl-7"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Form>

              <Button 
                onClick={handleUpload} 
                className="w-full bg-lawfirm-light-blue hover:bg-lawfirm-light-blue/90 text-white"
                disabled={!file || isUploading || isProcessing}
              >
                {isUploading ? 'Uploading...' : isProcessing ? 'Processing...' : 'Process Bill with AI'}
              </Button>
            </>
          )}

          {!isProcessing && showResults && (
            <>
              <div className="space-y-6">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Calculator className="h-5 w-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">AI Analysis Complete</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>The AI has analyzed the medical bills and calculated the reduced lien amounts.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Extracted Bill Data</h3>
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Provider</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Original</TableHead>
                          <TableHead className="text-right">Reduced</TableHead>
                          <TableHead className="text-right">Savings</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extractedBills.map((bill) => (
                          <TableRow key={bill.id}>
                            <TableCell className="font-medium">{bill.provider}</TableCell>
                            <TableCell>{bill.description}</TableCell>
                            <TableCell className="text-right">{formatCurrency(bill.originalAmount)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(bill.reducedAmount)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(bill.originalAmount - bill.reducedAmount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="rounded-md bg-lawfirm-light-blue bg-opacity-10 p-4 space-y-3">
                  <h3 className="text-sm font-semibold">AI Lien Reduction Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Original</p>
                      <p className="text-lg font-semibold">{formatCurrency(totalOriginal)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Reduced</p>
                      <p className="text-lg font-semibold">{formatCurrency(totalReduced)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Savings</p>
                      <p className="text-lg font-semibold">{formatCurrency(totalSavings)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Savings %</p>
                      <p className="text-lg font-semibold">{savingsPercentage}%</p>
                    </div>
                  </div>
                </div>
              
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleDownloadReport}
                    className="flex-1 gap-2" 
                    variant="outline"
                  >
                    <Download className="h-4 w-4" /> Download Report
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setShowResults(false);
                      setIsEmailBill(false);
                    }}
                    className="flex-1 bg-lawfirm-light-blue hover:bg-lawfirm-light-blue/90 text-white"
                  >
                    Process Another Bill
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiLienCalculator;
