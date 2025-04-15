
import { v4 as uuidv4 } from 'uuid';

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'attorney' | 'paralegal' | 'staff';
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
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
    lastActive: new Date().toISOString()
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'attorney',
    status: 'active',
    createdAt: new Date(Date.now() - 25 * 24 * 3600000).toISOString(),
    lastActive: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'user3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    role: 'paralegal',
    status: 'active',
    createdAt: new Date(Date.now() - 20 * 24 * 3600000).toISOString(),
    lastActive: new Date(Date.now() - 8 * 3600000).toISOString()
  },
  {
    id: 'user4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'staff',
    status: 'inactive',
    createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
    lastActive: new Date(Date.now() - 5 * 24 * 3600000).toISOString()
  }
];

// Mock data for roles
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
    permissions: ['read:clients', 'write:clients', 'read:cases', 'write:cases', 'read:billing', 'write:billing'],
    description: 'Access to client and case information, and billing'
  },
  {
    id: 'role3',
    name: 'Paralegal',
    permissions: ['read:clients', 'write:clients', 'read:cases', 'write:cases'],
    description: 'Access to client and case information'
  },
  {
    id: 'role4',
    name: 'Staff',
    permissions: ['read:clients', 'read:cases'],
    description: 'Read-only access to client and case information'
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
  }
};
