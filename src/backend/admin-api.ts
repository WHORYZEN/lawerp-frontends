
import { v4 as uuidv4 } from 'uuid';

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'attorney' | 'paralegal' | 'staff' | 'billing_admin' | 'case_manager' | 'medical_staff';
  permissions?: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  lastActive: string;
}

// Role types
export interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

// Audit log types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    permissions: ['all'],
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
    lastActive: new Date().toISOString()
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'attorney',
    permissions: ['view:clients', 'edit:clients', 'view:cases', 'edit:cases', 'view:documents', 'upload:documents', 'view:patients'],
    status: 'active',
    createdAt: new Date(Date.now() - 25 * 24 * 3600000).toISOString(),
    lastActive: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'user3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    role: 'paralegal',
    permissions: ['view:clients', 'view:cases', 'view:documents', 'upload:documents', 'view:patients'],
    status: 'active',
    createdAt: new Date(Date.now() - 20 * 24 * 3600000).toISOString(),
    lastActive: new Date(Date.now() - 8 * 3600000).toISOString()
  },
  {
    id: 'user4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'staff',
    permissions: ['view:clients', 'view:cases', 'view:patients'],
    status: 'inactive',
    createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
    lastActive: new Date(Date.now() - 5 * 24 * 3600000).toISOString()
  },
  {
    id: 'user5',
    name: 'Robert Chen',
    email: 'robert.chen@example.com',
    role: 'case_manager',
    permissions: [
      'view:cases', 'create:cases', 'edit:cases', 'delete:cases', 'assign:attorney',
      'view:clients', 'edit:clients', 'view:documents', 'upload:documents'
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
    lastActive: new Date(Date.now() - 1 * 24 * 3600000).toISOString()
  },
  {
    id: 'user6',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@example.com',
    role: 'medical_staff',
    permissions: [
      'view:medical', 'create:medical', 'edit:medical', 'upload:medical', 
      'view:patients', 'edit:patients', 'upload:patient-records'
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 18 * 24 * 3600000).toISOString(),
    lastActive: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    id: 'user7',
    name: 'David Thompson',
    email: 'david.thompson@example.com',
    role: 'billing_admin',
    permissions: [
      'view:billing', 'edit:billing', 'calculate:settlements', 'process:payments',
      'manage:settlements', 'view:documents', 'upload:invoices'
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 22 * 24 * 3600000).toISOString(),
    lastActive: new Date(Date.now() - 12 * 3600000).toISOString()
  }
];

// Mock roles with detailed permissions
const mockRoles: Role[] = [
  {
    id: 'role1',
    name: 'Administrator',
    permissions: ['all'],
    description: 'Full access to all system functions'
  },
  {
    id: 'role2',
    name: 'Attorney',
    permissions: [
      'view:clients', 'edit:clients',
      'view:cases', 'edit:cases', 'assign:attorney',
      'view:attorneys',
      'view:documents', 'upload:documents', 'download:documents',
      'view:patients', 'view:medical',
      'view:chat', 'add:notes',
      'view:notifications'
    ],
    description: 'Legal representation and case management'
  },
  {
    id: 'role3',
    name: 'Paralegal',
    permissions: [
      'view:clients', 'view:cases',
      'view:documents', 'upload:documents', 'download:documents',
      'view:patients',
      'view:chat', 'add:notes',
      'view:notifications'
    ],
    description: 'Legal assistant with document management access'
  },
  {
    id: 'role4',
    name: 'Staff',
    permissions: [
      'view:clients', 
      'view:attorneys',
      'view:cases',
      'view:documents',
      'view:notifications'
    ],
    description: 'Basic viewer access to system information'
  },
  {
    id: 'role5',
    name: 'Billing Administrator',
    permissions: [
      'view:billing', 'edit:billing',
      'calculate:settlements', 'process:payments', 'manage:settlements',
      'view:documents', 'upload:invoices', 'download:documents',
      'view:reports', 'generate:reports', 'download:reports'
    ],
    description: 'Full access to billing and settlement functions'
  },
  {
    id: 'role6',
    name: 'Case Manager',
    permissions: [
      'view:cases', 'create:cases', 'edit:cases', 'delete:cases', 'assign:attorney',
      'view:clients', 'edit:clients', 
      'view:attorneys',
      'view:documents', 'upload:documents', 'download:documents',
      'view:notifications', 'view:chat', 'add:notes'
    ],
    description: 'Manages case workflow and assignments'
  },
  {
    id: 'role7',
    name: 'Medical Staff',
    permissions: [
      'view:medical', 'create:medical', 'edit:medical', 'upload:medical', 'download:medical',
      'view:patients', 'edit:patients', 'upload:patient-records', 'download:patient-records',
      'view:reports', 'generate:reports'
    ],
    description: 'Handles patient medical information and records'
  }
];

// Mock data for audit logs
const mockAuditLogs: AuditLog[] = [
  {
    id: 'log1',
    userId: 'user1',
    action: 'login',
    details: 'User logged in',
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    ipAddress: '192.168.1.1'
  },
  {
    id: 'log2',
    userId: 'user2',
    action: 'update_client',
    details: 'Updated client information for client1',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    ipAddress: '192.168.1.2'
  },
  {
    id: 'log3',
    userId: 'user3',
    action: 'create_case',
    details: 'Created new case for client2',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    ipAddress: '192.168.1.3'
  },
  {
    id: 'log4',
    userId: 'user1',
    action: 'delete_file',
    details: 'Deleted file from case3',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    ipAddress: '192.168.1.1'
  }
];

// Admin API
export const adminApi = {
  // User Management
  getUsers: async (): Promise<User[]> => {
    return mockUsers;
  },

  getUser: async (id: string): Promise<User | null> => {
    const user = mockUsers.find(user => user.id === id);
    return user || null;
  },

  createUser: async (userData: Omit<User, 'id' | 'createdAt' | 'lastActive'>): Promise<User> => {
    const newUser: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    mockUsers.push(newUser);
    
    // Log the action
    mockAuditLogs.push({
      id: uuidv4(),
      userId: 'user1', // Assuming current user is user1
      action: 'create_user',
      details: `Created new user: ${newUser.name}`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1'
    });
    
    return newUser;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User | null> => {
    const user = mockUsers.find(user => user.id === id);
    if (user) {
      Object.assign(user, userData);
      
      // Log the action
      mockAuditLogs.push({
        id: uuidv4(),
        userId: 'user1', // Assuming current user is user1
        action: 'update_user',
        details: `Updated user: ${user.name}`,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1'
      });
      
      return user;
    }
    return null;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    const index = mockUsers.findIndex(user => user.id === id);
    if (index !== -1) {
      const user = mockUsers[index];
      mockUsers.splice(index, 1);
      
      // Log the action
      mockAuditLogs.push({
        id: uuidv4(),
        userId: 'user1', // Assuming current user is user1
        action: 'delete_user',
        details: `Deleted user: ${user.name}`,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1'
      });
      
      return true;
    }
    return false;
  },

  // User Permissions Management
  updateUserPermissions: async (id: string, permissions: string[]): Promise<User | null> => {
    const user = mockUsers.find(user => user.id === id);
    if (user) {
      user.permissions = permissions;
      
      // Log the action
      mockAuditLogs.push({
        id: uuidv4(),
        userId: 'user1', // Assuming current user is user1
        action: 'update_user_permissions',
        details: `Updated permissions for user: ${user.name}`,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1'
      });
      
      return user;
    }
    return null;
  },

  // Role Management
  getRoles: async (): Promise<Role[]> => {
    return mockRoles;
  },

  getRole: async (id: string): Promise<Role | null> => {
    const role = mockRoles.find(role => role.id === id);
    return role || null;
  },

  createRole: async (roleData: Omit<Role, 'id'>): Promise<Role> => {
    const newRole: Role = {
      ...roleData,
      id: uuidv4()
    };
    mockRoles.push(newRole);
    
    // Log the action
    mockAuditLogs.push({
      id: uuidv4(),
      userId: 'user1', // Assuming current user is user1
      action: 'create_role',
      details: `Created new role: ${newRole.name}`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1'
    });
    
    return newRole;
  },

  updateRole: async (id: string, roleData: Partial<Role>): Promise<Role | null> => {
    const role = mockRoles.find(role => role.id === id);
    if (role) {
      Object.assign(role, roleData);
      
      // Log the action
      mockAuditLogs.push({
        id: uuidv4(),
        userId: 'user1', // Assuming current user is user1
        action: 'update_role',
        details: `Updated role: ${role.name}`,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1'
      });
      
      return role;
    }
    return null;
  },

  deleteRole: async (id: string): Promise<boolean> => {
    const index = mockRoles.findIndex(role => role.id === id);
    if (index !== -1) {
      const role = mockRoles[index];
      mockRoles.splice(index, 1);
      
      // Log the action
      mockAuditLogs.push({
        id: uuidv4(),
        userId: 'user1', // Assuming current user is user1
        action: 'delete_role',
        details: `Deleted role: ${role.name}`,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1'
      });
      
      return true;
    }
    return false;
  },

  // Audit Logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    return mockAuditLogs;
  },

  getAuditLogsByUser: async (userId: string): Promise<AuditLog[]> => {
    return mockAuditLogs.filter(log => log.userId === userId);
  },

  getAuditLogsByAction: async (action: string): Promise<AuditLog[]> => {
    return mockAuditLogs.filter(log => log.action === action);
  },

  // Apply role permissions to user
  applyRoleToUser: async (userId: string, roleId: string): Promise<User | null> => {
    const user = mockUsers.find(user => user.id === userId);
    const role = mockRoles.find(role => role.id === roleId);
    
    if (user && role) {
      // Map role name to user.role type
      let roleType: 'admin' | 'attorney' | 'paralegal' | 'staff' | 'billing_admin' | 'case_manager' | 'medical_staff';
      
      switch (role.name.toLowerCase()) {
        case 'administrator':
          roleType = 'admin';
          break;
        case 'attorney':
          roleType = 'attorney';
          break;
        case 'paralegal':
          roleType = 'paralegal';
          break;
        case 'billing administrator':
          roleType = 'billing_admin';
          break;
        case 'case manager':
          roleType = 'case_manager';
          break;
        case 'medical staff':
          roleType = 'medical_staff';
          break;
        default:
          roleType = 'staff';
      }
      
      user.role = roleType;
      user.permissions = [...role.permissions];
      
      // Log the action
      mockAuditLogs.push({
        id: uuidv4(),
        userId: 'user1', // Assuming current user is user1
        action: 'apply_role',
        details: `Applied role ${role.name} to user: ${user.name}`,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1'
      });
      
      return user;
    }
    
    return null;
  },
  
  // Check if a user has a specific permission
  userHasPermission: async (userId: string, permission: string): Promise<boolean> => {
    const user = mockUsers.find(user => user.id === userId);
    
    if (!user || !user.permissions) return false;
    
    // If user has 'all' permission or the specific permission
    if (user.permissions.includes('all') || user.permissions.includes(permission)) {
      return true;
    }
    
    return false;
  },
  
  // Get permissions module structure (for UI)
  getPermissionsStructure: async (): Promise<any> => {
    // This would return the permission modules structure that the UI uses
    // For now, return a simple structure
    return {
      modules: [
        { id: 'clients', name: 'Clients' },
        { id: 'attorneys', name: 'Attorneys' },
        { id: 'cases', name: 'Case Management' },
        { id: 'medical', name: 'Medical Management' },
        { id: 'billing', name: 'Billing & Settlements' },
        { id: 'documents', name: 'Documents' },
        { id: 'chatbot', name: 'Chatbot & Notes' },
        { id: 'reports', name: 'Reports' },
        { id: 'notifications', name: 'Notifications' },
        { id: 'patients', name: 'Patients' },
        { id: 'admin', name: 'Admin Controls' },
      ],
      types: ['view', 'create', 'edit', 'delete', 'upload', 'download']
    };
  }
};

