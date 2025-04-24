
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Mail, 
  Bell, 
  Shield, 
  Database, 
  FileText, 
  Briefcase,
  Users,
  Receipt,
  Calculator
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const SystemSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  
  const [generalSettings, setGeneralSettings] = useState({
    firmName: 'LYZ Law Firm',
    contactEmail: 'contact@lyzlawfirm.com',
    enablePatientPortal: true,
    enableClientPortal: true,
    enableAttorneyPortal: true,
    allowFileUploads: true,
  });

  const [featureFlags, setFeatureFlags] = useState({
    patients: true,
    clients: true, 
    attorneys: true,
    depositions: true,
    billing: true,
    calculator: true,
    documents: true,
    calendar: true,
  });

  const handleGeneralSettingChange = (key: string, value: string | boolean) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFeatureFlagChange = (key: string, value: boolean) => {
    setFeatureFlags(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would call an API to save settings
    toast({
      title: "Settings Saved",
      description: "Your system settings have been updated.",
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>
            Configure system-wide settings, features, and integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firmName">Firm Name</Label>
                      <Input 
                        id="firmName" 
                        value={generalSettings.firmName}
                        onChange={(e) => handleGeneralSettingChange('firmName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input 
                        id="contactEmail" 
                        type="email"
                        value={generalSettings.contactEmail}
                        onChange={(e) => handleGeneralSettingChange('contactEmail', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Portal Access</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enablePatientPortal">Patient Portal</Label>
                        <p className="text-sm text-muted-foreground">Allow patients to access their portal</p>
                      </div>
                      <Switch 
                        id="enablePatientPortal" 
                        checked={generalSettings.enablePatientPortal}
                        onCheckedChange={(checked) => handleGeneralSettingChange('enablePatientPortal', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableClientPortal">Client Portal</Label>
                        <p className="text-sm text-muted-foreground">Allow clients to access their portal</p>
                      </div>
                      <Switch 
                        id="enableClientPortal" 
                        checked={generalSettings.enableClientPortal}
                        onCheckedChange={(checked) => handleGeneralSettingChange('enableClientPortal', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableAttorneyPortal">Attorney Portal</Label>
                        <p className="text-sm text-muted-foreground">Allow attorneys to access their portal</p>
                      </div>
                      <Switch 
                        id="enableAttorneyPortal" 
                        checked={generalSettings.enableAttorneyPortal}
                        onCheckedChange={(checked) => handleGeneralSettingChange('enableAttorneyPortal', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowFileUploads">File Uploads</Label>
                        <p className="text-sm text-muted-foreground">Allow users to upload files to the system</p>
                      </div>
                      <Switch 
                        id="allowFileUploads" 
                        checked={generalSettings.allowFileUploads}
                        onCheckedChange={(checked) => handleGeneralSettingChange('allowFileUploads', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Patient Portal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Enable Patient Portal</p>
                        <Switch 
                          checked={featureFlags.patients}
                          onCheckedChange={(checked) => handleFeatureFlagChange('patients', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Client Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Enable Client Features</p>
                        <Switch 
                          checked={featureFlags.clients}
                          onCheckedChange={(checked) => handleFeatureFlagChange('clients', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Attorney Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Enable Attorney Features</p>
                        <Switch 
                          checked={featureFlags.attorneys}
                          onCheckedChange={(checked) => handleFeatureFlagChange('attorneys', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Depositions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Enable Deposition Features</p>
                        <Switch 
                          checked={featureFlags.depositions}
                          onCheckedChange={(checked) => handleFeatureFlagChange('depositions', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Billing & Settlements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Enable Billing Features</p>
                        <Switch 
                          checked={featureFlags.billing}
                          onCheckedChange={(checked) => handleFeatureFlagChange('billing', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        AI Lien Reduction Calculator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Enable AI Calculator</p>
                        <Switch 
                          checked={featureFlags.calculator}
                          onCheckedChange={(checked) => handleFeatureFlagChange('calculator', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>Configure security policies for the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Session Timeout</Label>
                          <p className="text-sm text-muted-foreground">Automatically log users out after inactivity</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>IP Restrictions</Label>
                          <p className="text-sm text-muted-foreground">Limit access to specific IP addresses</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="integrations">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>API Integrations</CardTitle>
                    <CardDescription>Manage external service connections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Service</Label>
                          <p className="text-sm text-muted-foreground">Connect to email provider</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Payment Gateway</Label>
                          <p className="text-sm text-muted-foreground">Connect to payment processor</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Document Storage</Label>
                          <p className="text-sm text-muted-foreground">Connect to cloud storage provider</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
