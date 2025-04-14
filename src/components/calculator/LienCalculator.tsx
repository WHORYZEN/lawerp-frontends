
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LienCalculator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    settlementAmount: "",
    attorneyFees: "",
    caseExpenses: "",
    medicalBills: "",
    lienAmount: "",
  });

  const [results, setResults] = useState({
    netSettlement: 0,
    reducedLien: 0,
    clientRecovery: 0,
    lienReductionPercentage: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow only numbers and decimal point
    const sanitizedValue = value.replace(/[^\d.]/g, "");
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const calculateLienReduction = () => {
    // Convert input strings to numbers
    const settlementAmount = parseFloat(formData.settlementAmount) || 0;
    const attorneyFees = parseFloat(formData.attorneyFees) || 0;
    const caseExpenses = parseFloat(formData.caseExpenses) || 0;
    const medicalBills = parseFloat(formData.medicalBills) || 0;
    const lienAmount = parseFloat(formData.lienAmount) || 0;

    // Validation
    if (settlementAmount === 0) {
      toast({
        title: "Error",
        description: "Settlement amount is required",
        variant: "destructive",
      });
      return;
    }

    // Calculate net settlement
    const netSettlement = settlementAmount - attorneyFees - caseExpenses;

    // Calculate reduced lien based on a proportional formula
    let reducedLien = 0;
    if (medicalBills > 0) {
      // Typical lien reduction formula - can be adjusted based on specific legal requirements
      const ratio = netSettlement / (medicalBills + netSettlement);
      reducedLien = Math.min(lienAmount * ratio, lienAmount);
    }

    // Calculate client recovery
    const clientRecovery = netSettlement - reducedLien;

    // Calculate reduction percentage
    const lienReductionPercentage = lienAmount > 0 
      ? ((lienAmount - reducedLien) / lienAmount) * 100 
      : 0;

    setResults({
      netSettlement,
      reducedLien,
      clientRecovery,
      lienReductionPercentage,
    });

    toast({
      title: "Calculation Complete",
      description: "Lien reduction has been calculated successfully.",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="bg-lawfirm-light-blue bg-opacity-10">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-lawfirm-light-blue" />
          <CardTitle className="text-lg font-medium">AT Lien Reduction Calculator</CardTitle>
        </div>
        <CardDescription>
          Calculate potential lien reductions for personal injury cases
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="settlementAmount">Settlement Amount</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
              <Input
                id="settlementAmount"
                name="settlementAmount"
                value={formData.settlementAmount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attorneyFees">Attorney Fees</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input
                  id="attorneyFees"
                  name="attorneyFees"
                  value={formData.attorneyFees}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caseExpenses">Case Expenses</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input
                  id="caseExpenses"
                  name="caseExpenses"
                  value={formData.caseExpenses}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medicalBills">Total Medical Bills</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input
                  id="medicalBills"
                  name="medicalBills"
                  value={formData.medicalBills}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lienAmount">Lien Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input
                  id="lienAmount"
                  name="lienAmount"
                  value={formData.lienAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={calculateLienReduction} 
            className="w-full bg-lawfirm-light-blue hover:bg-lawfirm-light-blue/90 text-white"
          >
            Calculate Lien Reduction
          </Button>
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="flex flex-col p-6">
        <h3 className="text-sm font-semibold mb-3">Results</h3>
        <div className="space-y-2 w-full">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Net Settlement:</span>
            <span className="font-medium">{formatCurrency(results.netSettlement)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reduced Lien:</span>
            <span className="font-medium">{formatCurrency(results.reducedLien)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client Recovery:</span>
            <span className="font-medium">{formatCurrency(results.clientRecovery)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lien Reduction:</span>
            <span className="font-medium">{results.lienReductionPercentage.toFixed(2)}%</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LienCalculator;
