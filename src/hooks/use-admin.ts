
import { useAuth } from '@/contexts/AuthContext';

export const useAdmin = () => {
  const { currentUser, checkUserPermission } = useAuth();

  const isAdmin = currentUser?.role === 'admin';
  
  const isAdminOrPending = currentUser?.role === 'admin' || currentUser?.role === 'pending_admin';
  
  const canAccessAdminPanel = isAdmin;
  
  const canManageUsers = isAdmin;
  
  const canApproveUsers = isAdmin;
  
  const canManageRoles = isAdmin;
  
  const canViewAuditLogs = isAdmin;
  
  return {
    isAdmin,
    isAdminOrPending,
    canAccessAdminPanel,
    canManageUsers,
    canManageRoles,
    canApproveUsers,
    canViewAuditLogs
  };
};
