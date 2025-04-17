
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole | UserRole[];
  redirectTo?: string;
}

const RoleProtectedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo = "/dashboard" 
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, currentUser, checkUserPermission } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please log in to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!checkUserPermission(allowedRoles)) {
    toast({
      title: "Access Denied",
      description: `You don't have permission to access this area.`,
      variant: "destructive",
    });
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default RoleProtectedRoute;
