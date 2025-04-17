
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PendingUser {
  email: string;
  role: string;
  registeredAt: string;
}

const UserRoleApproval: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = () => {
    setLoading(true);
    
    // Fetch users from local storage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Filter for pending admin users
    const pending = registeredUsers.filter((user: any) => 
      user.role === 'pending_admin' && user.isVerified
    );
    
    setPendingUsers(pending);
    setLoading(false);
  };

  const handleApproveUser = (email: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    const updatedUsers = registeredUsers.map((user: any) => {
      if (user.email === email) {
        return { ...user, role: 'admin' };
      }
      return user;
    });
    
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Refresh the list
    loadPendingUsers();
    
    toast({
      title: "User Approved",
      description: `${email} has been approved as an administrator.`,
    });
    
    // In a real app, we would send an email notification here
    console.log(`Admin approval email sent to ${email}`);
  };

  const handleRejectUser = (email: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    const updatedUsers = registeredUsers.map((user: any) => {
      if (user.email === email) {
        return { ...user, role: 'staff' };
      }
      return user;
    });
    
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Refresh the list
    loadPendingUsers();
    
    toast({
      title: "Request Rejected",
      description: `${email}'s admin request has been rejected. They have been assigned the staff role.`,
    });
    
    // In a real app, we would send an email notification here
    console.log(`Admin rejection email sent to ${email}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Pending Admin Approvals
        </CardTitle>
        <CardDescription>
          Review and approve administrator role requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading pending approvals...</div>
        ) : pendingUsers.length === 0 ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>All Clear</AlertTitle>
            <AlertDescription>
              There are no pending admin approval requests at this time.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user) => (
              <div key={user.email} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="font-medium">{user.email}</div>
                  <div className="text-sm text-gray-500">
                    Registered: {new Date(user.registeredAt).toLocaleDateString()}
                  </div>
                  <Badge className="mt-2 bg-amber-500">Pending Admin Approval</Badge>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleRejectUser(user.email)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveUser(user.email)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRoleApproval;
