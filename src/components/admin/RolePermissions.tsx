
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Lock } from 'lucide-react';

interface PermissionProps {
  role: string;
  permissions: string[];
  onUpdatePermissions: (permissions: string[]) => void;
}

const availablePermissions = [
  // Patient Portal
  { id: 'access:patient-portal', label: 'Access Patient Portal', category: 'Patient Portal' },
  { id: 'manage:patient-records', label: 'Manage Patient Records', category: 'Patient Portal' },
  { id: 'view:patient-appointments', label: 'View Appointments', category: 'Patient Portal' },
  { id: 'schedule:appointments', label: 'Schedule Appointments', category: 'Patient Portal' },
  
  // Client Management
  { id: 'access:client-portal', label: 'Access Client Portal', category: 'Clients' },
  { id: 'view:clients', label: 'View Clients', category: 'Clients' },
  { id: 'manage:clients', label: 'Manage Clients', category: 'Clients' },
  { id: 'delete:clients', label: 'Delete Clients', category: 'Clients' },
  
  // Attorney Management
  { id: 'access:attorney-portal', label: 'Access Attorney Portal', category: 'Attorneys' },
  { id: 'view:attorneys', label: 'View Attorneys', category: 'Attorneys' },
  { id: 'manage:attorneys', label: 'Manage Attorneys', category: 'Attorneys' },
  { id: 'assign:cases', label: 'Assign Cases', category: 'Attorneys' },
  
  // Depositions
  { id: 'access:depositions', label: 'Access Depositions', category: 'Depositions' },
  { id: 'schedule:depositions', label: 'Schedule Depositions', category: 'Depositions' },
  { id: 'manage:transcripts', label: 'Manage Transcripts', category: 'Depositions' },
  { id: 'view:deposition-calendar', label: 'View Calendar', category: 'Depositions' },
  
  // Billing & Settlements
  { id: 'access:billing', label: 'Access Billing', category: 'Billing' },
  { id: 'manage:invoices', label: 'Manage Invoices', category: 'Billing' },
  { id: 'process:payments', label: 'Process Payments', category: 'Billing' },
  { id: 'manage:settlements', label: 'Manage Settlements', category: 'Billing' },
  
  // AI Lien Calculator
  { id: 'access:calculator', label: 'Access AI Calculator', category: 'Calculator' },
  { id: 'run:calculations', label: 'Run Calculations', category: 'Calculator' },
  { id: 'view:reduction-history', label: 'View History', category: 'Calculator' },
  { id: 'export:reports', label: 'Export Reports', category: 'Calculator' },
  
  // Documents
  { id: 'access:documents', label: 'Access Documents', category: 'Documents' },
  { id: 'upload:documents', label: 'Upload Documents', category: 'Documents' },
  { id: 'manage:documents', label: 'Manage Documents', category: 'Documents' },
  { id: 'delete:documents', label: 'Delete Documents', category: 'Documents' },
  
  // System Access
  { id: 'access:admin-panel', label: 'Access Admin Panel', category: 'Administration' },
  { id: 'manage:users', label: 'Manage Users', category: 'Administration' },
  { id: 'manage:roles', label: 'Manage Roles', category: 'Administration' },
  { id: 'view:audit-logs', label: 'View Audit Logs', category: 'Administration' },
  
  // All Permissions
  { id: 'all', label: 'All Permissions (Admin)', category: 'Special' },
];

const RolePermissions: React.FC<PermissionProps> = ({
  role,
  permissions,
  onUpdatePermissions,
}) => {
  const handleTogglePermission = (permissionId: string) => {
    if (permissionId === 'all') {
      if (permissions.includes('all')) {
        onUpdatePermissions(permissions.filter(p => p !== 'all'));
      } else {
        onUpdatePermissions(['all']);
      }
      return;
    }
    
    if (permissions.includes('all')) {
      const allPermissionsExcept = availablePermissions
        .filter(p => p.id !== 'all' && p.id !== permissionId)
        .map(p => p.id);
      onUpdatePermissions(allPermissionsExcept);
      return;
    }
    
    const updatedPermissions = permissions.includes(permissionId)
      ? permissions.filter(p => p !== permissionId)
      : [...permissions, permissionId];
    
    onUpdatePermissions(updatedPermissions);
  };

  // Group permissions by category
  const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof availablePermissions>);

  const hasAllPermission = permissions.includes('all');

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {role} Permissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Special 'All Permissions' switch at the top */}
        <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <Label htmlFor="permission-all" className="font-medium text-purple-800">
                All Permissions
              </Label>
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                Full Access
              </span>
            </div>
            <Switch
              id="permission-all"
              checked={hasAllPermission}
              onCheckedChange={() => handleTogglePermission('all')}
            />
          </div>
        </div>

        {/* Render permissions by category */}
        <div className="space-y-6">
          {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
            category !== 'Special' && (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground border-b pb-1">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryPermissions.map((permission) => (
                    <div 
                      key={permission.id} 
                      className="flex items-center justify-between p-2 rounded-lg border"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Label 
                          htmlFor={`permission-${permission.id}`} 
                          className="text-sm cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                      </div>
                      <Switch
                        id={`permission-${permission.id}`}
                        checked={permissions.includes(permission.id) || hasAllPermission}
                        disabled={hasAllPermission}
                        onCheckedChange={() => handleTogglePermission(permission.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={() => onUpdatePermissions(permissions)}
            variant="outline"
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolePermissions;
