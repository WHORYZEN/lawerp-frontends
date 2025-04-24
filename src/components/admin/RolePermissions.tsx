
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
  // Client Management
  { id: 'read:clients', label: 'View Clients', category: 'Clients' },
  { id: 'write:clients', label: 'Modify Clients', category: 'Clients' },
  { id: 'delete:clients', label: 'Delete Clients', category: 'Clients' },
  
  // Case Management
  { id: 'read:cases', label: 'View Cases', category: 'Cases' },
  { id: 'write:cases', label: 'Modify Cases', category: 'Cases' },
  { id: 'delete:cases', label: 'Delete Cases', category: 'Cases' },
  
  // Patient Management
  { id: 'read:patients', label: 'View Patients', category: 'Patients' },
  { id: 'write:patients', label: 'Modify Patients', category: 'Patients' },
  { id: 'message:patients', label: 'Message Patients', category: 'Patients' },
  
  // Attorney Management
  { id: 'read:attorneys', label: 'View Attorneys', category: 'Attorneys' },
  { id: 'write:attorneys', label: 'Modify Attorneys', category: 'Attorneys' },
  { id: 'assign:attorneys', label: 'Assign Attorneys', category: 'Attorneys' },
  
  // Depositions
  { id: 'read:depositions', label: 'View Depositions', category: 'Depositions' },
  { id: 'write:depositions', label: 'Schedule Depositions', category: 'Depositions' },
  { id: 'upload:depositions', label: 'Upload Transcripts', category: 'Depositions' },
  
  // Billing & Settlements
  { id: 'read:billing', label: 'View Billing', category: 'Billing' },
  { id: 'write:billing', label: 'Modify Billing', category: 'Billing' },
  { id: 'create:invoices', label: 'Create Invoices', category: 'Billing' },
  { id: 'manage:settlements', label: 'Manage Settlements', category: 'Billing' },
  
  // Documents
  { id: 'read:documents', label: 'View Documents', category: 'Documents' },
  { id: 'write:documents', label: 'Upload Documents', category: 'Documents' },
  { id: 'delete:documents', label: 'Delete Documents', category: 'Documents' },
  
  // Calculator
  { id: 'use:calculator', label: 'Use AI Calculator', category: 'Calculator' },
  { id: 'configure:calculator', label: 'Configure AI Calculator', category: 'Calculator' },
  
  // Admin
  { id: 'admin:users', label: 'Manage Users', category: 'Administration' },
  { id: 'admin:roles', label: 'Manage Roles', category: 'Administration' },
  { id: 'admin:settings', label: 'Manage Settings', category: 'Administration' },
  { id: 'admin:logs', label: 'View Audit Logs', category: 'Administration' },
  
  // All Permissions
  { id: 'all', label: 'All Permissions (Admin)', category: 'Special' },
];

const RolePermissions: React.FC<PermissionProps> = ({
  role,
  permissions,
  onUpdatePermissions,
}) => {
  const handleTogglePermission = (permissionId: string) => {
    // If toggling 'all' permission
    if (permissionId === 'all') {
      if (permissions.includes('all')) {
        // If already has 'all', remove it
        onUpdatePermissions(permissions.filter(p => p !== 'all'));
      } else {
        // If doesn't have 'all', set only 'all'
        onUpdatePermissions(['all']);
      }
      return;
    }
    
    // If has 'all' permission and trying to toggle specific permission
    if (permissions.includes('all')) {
      // Remove 'all' and add all other permissions except the toggled one
      const allPermissionsExcept = availablePermissions
        .filter(p => p.id !== 'all' && p.id !== permissionId)
        .map(p => p.id);
      onUpdatePermissions(allPermissionsExcept);
      return;
    }
    
    // Normal toggle for specific permission
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

  // Special handling for 'all' permission
  const allPermission = availablePermissions.find(p => p.id === 'all');
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
        {allPermission && (
          <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <Label htmlFor={`permission-${allPermission.id}`} className="font-medium text-purple-800">
                  {allPermission.label}
                </Label>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                  Grants all access
                </span>
              </div>
              <Switch
                id={`permission-${allPermission.id}`}
                checked={hasAllPermission}
                onCheckedChange={() => handleTogglePermission(allPermission.id)}
              />
            </div>
          </div>
        )}

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
          <Button variant="outline">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolePermissions;
