
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Lock, Shield, FileText } from 'lucide-react';

interface SecuritySettingsProps {
  isLoading: boolean;
  onLogout: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ isLoading, onLogout }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }
    
    if (newPassword !== confirmPassword) {
      return;
    }
    
    setIsSaving(true);
    // In a real app, this would call an API to change the password
    setTimeout(() => {
      // Simulate API call
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsSaving(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-[200px]" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <Lock className="h-5 w-5 mr-2" />
          Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}>
              {isSaving ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-medium flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Account Security
        </h3>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Active Sessions</Label>
              <p className="text-sm text-muted-foreground">
                Manage devices where you're currently logged in
              </p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>
          
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Account Activity</Label>
              <p className="text-sm text-muted-foreground">
                View your account's recent activity and login history
              </p>
            </div>
            <Button variant="outline">View</Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-medium flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Privacy Policy
        </h3>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Privacy Policy</Label>
              <p className="text-sm text-muted-foreground">
                View our privacy policy and learn how we protect your data
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Privacy Policy - LAW ERP 500</DialogTitle>
                  <DialogDescription>
                    Last Updated: April 16, 2025
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-4 p-4">
                    <h4 className="text-lg font-semibold">1. Introduction</h4>
                    <p>
                      Welcome to LAW ERP 500. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our law firm practice management software. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
                    </p>
                    
                    <h4 className="text-lg font-semibold">2. Information We Collect</h4>
                    <p>
                      We collect information that you provide directly to us when you register for an account, create or modify your profile, set preferences, or make purchases through the platform. This includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Personal information such as your name, email address, phone number, and physical address</li>
                      <li>Professional information such as your bar number, title, and practice areas</li>
                      <li>Client information that you enter into the system</li>
                      <li>Case details, documents, and related information</li>
                      <li>Billing and payment information</li>
                    </ul>
                    
                    <h4 className="text-lg font-semibold">3. How We Use Your Information</h4>
                    <p>
                      We use the information we collect or receive:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>To facilitate account creation and the login process</li>
                      <li>To provide, maintain, and improve our services</li>
                      <li>To process transactions and send related information</li>
                      <li>To send administrative information including confirmations, technical notices, updates, security alerts, and support messages</li>
                      <li>To respond to your comments, questions, and requests</li>
                      <li>To protect our services and users from fraudulent, unauthorized, or illegal activity</li>
                    </ul>
                    
                    <h4 className="text-lg font-semibold">4. Security of Your Information</h4>
                    <p>
                      We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>
                    
                    <h4 className="text-lg font-semibold">5. Your Choices</h4>
                    <p>
                      You may at any time review or change the information in your account or terminate your account by:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Logging into your account settings and updating your information</li>
                      <li>Contacting us using the contact information provided below</li>
                    </ul>
                    <p>
                      Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.
                    </p>
                    
                    <h4 className="text-lg font-semibold">6. Contact Us</h4>
                    <p>
                      If you have questions or concerns about this Privacy Policy, please contact us at:
                    </p>
                    <p className="font-medium mt-2">
                      LAW ERP 500<br />
                      123 Legal Avenue<br />
                      Legal City, LC 12345<br />
                      Email: privacy@lawerp500.com<br />
                      Phone: (555) 123-4567
                    </p>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Data Retention Policy</Label>
              <p className="text-sm text-muted-foreground">
                Learn how long we keep your data and how to request deletion
              </p>
            </div>
            <Button variant="outline">View</Button>
          </div>
          
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Export Your Data</Label>
              <p className="text-sm text-muted-foreground">
                Download a copy of all your personal data
              </p>
            </div>
            <Button variant="outline">Export</Button>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to enter your credentials to log back in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onLogout}>Sign Out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SecuritySettings;
