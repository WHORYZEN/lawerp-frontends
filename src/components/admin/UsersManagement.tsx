
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User } from '@/backend/admin-api';
import { adminApi } from '@/backend';
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Plus, Trash2, UserCog, Settings, Mail, Shield, Key } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import RolePermissions from './RolePermissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff' as 'admin' | 'attorney' | 'paralegal' | 'staff' | 'billing_admin' | 'case_manager' | 'medical_staff',
    status: 'active' as 'active' | 'inactive'
  });
  const [emailSent, setEmailSent] = useState<{success: boolean, message: string} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const [fetchedUsers, fetchedRoles] = await Promise.all([
          adminApi.getUsers(),
          adminApi.getRoles()
        ]);
        
        setUsers(fetchedUsers);
        setRoles(fetchedRoles);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleCreateUser = async () => {
    try {
      const newUser = await adminApi.createUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        permissions: []
      });
      
      setUsers(prev => [...prev, newUser]);
      setEmailSent({
        success: true,
        message: `User created successfully. Welcome email sent to ${formData.email} with login credentials.`
      });
      
      setTimeout(() => {
        setIsCreateDialogOpen(false);
        resetForm();
        toast({
          title: "Success",
          description: "User created successfully and welcome email sent.",
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error creating user:', error);
      setEmailSent({
        success: false,
        message: `Failed to create user. Please try again.`
      });
      
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    try {
      const updatedUser = await adminApi.updateUser(selectedUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status
      });
      
      if (updatedUser) {
        setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
        setIsEditDialogOpen(false);
        resetForm();
        toast({
          title: "Success",
          description: "User updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const success = await adminApi.deleteUser(id);
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== id));
        toast({
          title: "Success",
          description: "User deleted successfully.",
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePermissions = async (permissions: string[]) => {
    if (!selectedUser) return;
    
    try {
      const updatedUser = await adminApi.updateUserPermissions(selectedUser.id, permissions);
      
      if (updatedUser) {
        setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
        toast({
          title: "Success",
          description: "User permissions updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating user permissions:', error);
      toast({
        title: "Error",
        description: "Failed to update user permissions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApplyRole = async (roleId: string) => {
    if (!selectedUser) return;
    
    try {
      const updatedUser = await adminApi.applyRoleToUser(selectedUser.id, roleId);
      
      if (updatedUser) {
        setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
        toast({
          title: "Success",
          description: `Applied role to user successfully.`,
        });
      }
    } catch (error) {
      console.error('Error applying role to user:', error);
      toast({
        title: "Error",
        description: "Failed to apply role to user. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleResendWelcomeEmail = async (userId: string) => {
    try {
      const success = await adminApi.resendWelcomeEmail(userId);
      if (success) {
        toast({
          title: "Success",
          description: "Password reset email sent successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send password reset email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsEditDialogOpen(true);
  };

  const openPermissionsDialog = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
    // Expand the first module by default for better UX
    if (permissionModules && permissionModules.length > 0) {
      setActiveTab('custom'); // Switch to custom permissions tab
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'staff',
      status: 'active'
    });
    setSelectedUser(null);
    setActiveTab('basic');
    setEmailSent(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system with specific role and permissions. An email with login credentials will be sent to the user.
              </DialogDescription>
            </DialogHeader>
            {emailSent && (
              <Alert className={emailSent.success ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}>
                <Mail className={`h-4 w-4 ${emailSent.success ? "text-green-600" : "text-red-600"}`} />
                <AlertTitle>{emailSent.success ? "Email Sent" : "Email Failed"}</AlertTitle>
                <AlertDescription>{emailSent.message}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
                <p className="text-xs text-muted-foreground">A welcome email with login credentials will be sent to this address.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="attorney">Attorney</SelectItem>
                    <SelectItem value="paralegal">Paralegal</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="billing_admin">Billing Admin</SelectItem>
                    <SelectItem value="case_manager">Case Manager</SelectItem>
                    <SelectItem value="medical_staff">Medical Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="status">Active Status</Label>
                <Switch
                  id="status"
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsCreateDialogOpen(false);
              }}>Cancel</Button>
              <Button 
                onClick={handleCreateUser}
                disabled={!formData.name || !formData.email || !!emailSent}
              >
                {emailSent ? "Processing..." : "Create User & Send Email"}
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No users found. Add a new user to get started.
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs 
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'attorney' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'paralegal' ? 'bg-green-100 text-green-800' :
                        user.role === 'billing_admin' ? 'bg-orange-100 text-orange-800' :
                        user.role === 'case_manager' ? 'bg-indigo-100 text-indigo-800' :
                        user.role === 'medical_staff' ? 'bg-teal-100 text-teal-800' :
                        'bg-gray-100 text-gray-800'}`}
                      >
                        {user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" title="Edit User" onClick={() => openEditDialog(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Permissions" onClick={() => openPermissionsDialog(user)}>
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Reset Password & Send Email" 
                          onClick={() => handleResendWelcomeEmail(user.id)}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete User" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="attorney">Attorney</SelectItem>
                  <SelectItem value="paralegal">Paralegal</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="billing_admin">Billing Admin</SelectItem>
                  <SelectItem value="case_manager">Case Manager</SelectItem>
                  <SelectItem value="medical_staff">Medical Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="edit-status">Active Status</Label>
              <Switch
                id="edit-status"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
            }}>Cancel</Button>
            <Button 
              onClick={handleEditUser}
              disabled={!formData.name || !formData.email}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Permissions Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage User Permissions</DialogTitle>
            <DialogDescription>
              {selectedUser ? `Configure access levels for ${selectedUser.name}` : 'Configure access levels'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="basic">Roles</TabsTrigger>
                <TabsTrigger value="custom">Custom Permissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <div key={role.id} className="border rounded-lg p-4 hover:border-purple-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg">{role.name}</h3>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                        <Button 
                          onClick={() => handleApplyRole(role.id)}
                          variant={selectedUser?.role === role.name.toLowerCase() ? "default" : "outline"}
                          size="sm"
                        >
                          {selectedUser?.role === role.name.toLowerCase() ? "Applied" : "Apply Role"}
                        </Button>
                      </div>
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-2">Permissions:</div>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.includes('all') ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                              All Permissions
                            </span>
                          ) : (
                            role.permissions.slice(0, 3).map((permission: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {permission.split(':')[1]}
                              </span>
                            ))
                          )}
                          {role.permissions.length > 3 && !role.permissions.includes('all') && (
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              +{role.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="custom">
                <RolePermissions
                  role={selectedUser.name}
                  permissions={selectedUser.permissions || []}
                  onUpdatePermissions={handleUpdatePermissions}
                />
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsPermissionsDialogOpen(false);
                setSelectedUser(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
