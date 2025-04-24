
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
  { id: 'read:clients', label: 'View Clients' },
  { id: 'write:clients', label: 'Modify Clients' },
  { id: 'read:cases', label: 'View Cases' },
  { id: 'write:cases', label: 'Modify Cases' },
  { id: 'read:billing', label: 'View Billing' },
  { id: 'write:billing', label: 'Modify Billing' },
  { id: 'admin:users', label: 'Manage Users' },
  { id: 'admin:settings', label: 'Manage Settings' },
];

const RolePermissions: React.FC<PermissionProps> = ({
  role,
  permissions,
  onUpdatePermissions,
}) => {
  const handleTogglePermission = (permissionId: string) => {
    const updatedPermissions = permissions.includes(permissionId)
      ? permissions.filter(p => p !== permissionId)
      : [...permissions, permissionId];
    
    onUpdatePermissions(updatedPermissions);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {role} Permissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availablePermissions.map((permission) => (
            <div key={permission.id} className="flex items-center justify-between p-2 rounded-lg border">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor={`permission-${permission.id}`} className="text-sm">
                  {permission.label}
                </Label>
              </div>
              <Switch
                id={`permission-${permission.id}`}
                checked={permissions.includes(permission.id)}
                onCheckedChange={() => handleTogglePermission(permission.id)}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolePermissions;

