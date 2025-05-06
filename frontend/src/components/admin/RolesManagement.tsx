import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Role } from '@/backend/admin-api';
import { adminApi } from '@/backend';
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import RolePermissions from './RolePermissions';

const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  const { toast } = useToast();

  const availablePermissions = [
    { id: 'read:clients', label: 'Read Client Data' },
    { id: 'write:clients', label: 'Modify Client Data' },
    { id: 'read:cases', label: 'Read Case Data' },
    { id: 'write:cases', label: 'Modify Case Data' },
    { id: 'read:billing', label: 'Read Billing Data' },
    { id: 'write:billing', label: 'Modify Billing Data' },
    { id: 'read:documents', label: 'Read Documents' },
    { id: 'write:documents', label: 'Modify Documents' },
    { id: 'admin:users', label: 'Manage Users' },
    { id: 'admin:settings', label: 'Manage System Settings' },
    { id: 'all', label: 'All Permissions (Admin)' }
  ];

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const fetchedRoles = await adminApi.getRoles();
        setRoles(fetchedRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast({
          title: "Error",
          description: "Failed to load roles. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [toast]);

  const handleCreateRole = async () => {
    try {
      const newRole = await adminApi.createRole({
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      });
      setRoles(prev => [...prev, newRole]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Role created successfully.",
      });
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: "Failed to create role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole) return;
    
    try {
      const updatedRole = await adminApi.updateRole(selectedRole.id, {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      });
      
      if (updatedRole) {
        setRoles(prev => prev.map(role => role.id === updatedRole.id ? updatedRole : role));
        setIsEditDialogOpen(false);
        resetForm();
        toast({
          title: "Success",
          description: "Role updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    
    try {
      const success = await adminApi.deleteRole(id);
      if (success) {
        setRoles(prev => prev.filter(role => role.id !== id));
        toast({
          title: "Success",
          description: "Role deleted successfully.",
        });
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
    setSelectedRole(null);
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => {
      // If selecting "all", clear other permissions
      if (permission === 'all') {
        return {
          ...prev,
          permissions: prev.permissions.includes('all') ? [] : ['all']
        };
      }
      
      // If a specific permission is selected, remove "all" if it's present
      const updatedPermissions = prev.permissions.filter(p => p !== 'all');
      
      // Toggle the specific permission
      if (updatedPermissions.includes(permission)) {
        return { ...prev, permissions: updatedPermissions.filter(p => p !== permission) };
      } else {
        return { ...prev, permissions: [...updatedPermissions, permission] };
      }
    });
  };

  const handleUpdatePermissions = async (roleId: string, newPermissions: string[]) => {
    try {
      const updatedRole = await adminApi.updateRole(roleId, {
        permissions: newPermissions
      });
      
      if (updatedRole) {
        setRoles(prev => prev.map(role => 
          role.id === updatedRole.id ? updatedRole : role
        ));
        toast({
          title: "Success",
          description: "Role permissions updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating role permissions:', error);
      toast({
        title: "Error",
        description: "Failed to update role permissions. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Role Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter role name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role's purpose and responsibilities"
                />
              </div>
              <div className="grid gap-2">
                <Label>Permissions</Label>
                <div className="border rounded-md p-4 space-y-2 max-h-[200px] overflow-y-auto">
                  {availablePermissions.map(permission => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`permission-${permission.id}`} 
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                      <Label 
                        htmlFor={`permission-${permission.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {permission.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsCreateDialogOpen(false);
              }}>Cancel</Button>
              <Button 
                onClick={handleCreateRole}
                disabled={!formData.name || formData.permissions.length === 0}
              >
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-[250px]" />
                <Skeleton className="h-4 w-[400px]" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No roles found. Add a new role to get started.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map(role => (
                  <React.Fragment key={role.id}>
                    <TableRow>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.includes('all') ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                              All Permissions
                            </span>
                          ) : (
                            role.permissions.map((permission, index) => (
                              <span key={index} className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {permission.split(':')[1]}
                              </span>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(role)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(role.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <RolePermissions
                          role={role.name}
                          permissions={role.permissions}
                          onUpdatePermissions={(newPermissions) => 
                            handleUpdatePermissions(role.id, newPermissions)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role information and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter role name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role's purpose and responsibilities"
              />
            </div>
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="border rounded-md p-4 space-y-2 max-h-[200px] overflow-y-auto">
                {availablePermissions.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`edit-permission-${permission.id}`} 
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <Label 
                      htmlFor={`edit-permission-${permission.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
            }}>Cancel</Button>
            <Button 
              onClick={handleEditRole}
              disabled={!formData.name || formData.permissions.length === 0}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesManagement;
