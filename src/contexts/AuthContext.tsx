
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { adminApi } from '@/backend';

export type UserRole = 'admin' | 'attorney' | 'paralegal' | 'staff' | 'pending_admin';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  currentUser: UserData | null;
  checkUserPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

interface UserData {
  email: string;
  isVerified: boolean;
  role: UserRole;
  id?: string;
  name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      
      // Get stored user data
      const userData = localStorage.getItem('userData');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // First check if this is a pre-registered user in the admin system
        const users = await adminApi.getUsers();
        const adminRegisteredUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        // Check if user exists in localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const localUser = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (localUser && localUser.password === password) {
          if (!localUser.isVerified) {
            reject(new Error('Email not verified. Please check your inbox.'));
            return;
          }
          
          const userData: UserData = {
            email: localUser.email,
            isVerified: localUser.isVerified,
            role: localUser.role || 'staff',
            name: localUser.name
          };

          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userData', JSON.stringify(userData));
          setIsAuthenticated(true);
          setCurrentUser(userData);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      } catch (error) {
        reject(new Error('Login failed. Please try again.'));
      }
    });
  };

  const register = async (email: string, password: string, requestedRole: UserRole): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // Check if email already exists in the system
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const existingUser = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
          reject(new Error('User with this email already exists'));
          return;
        }
        
        // Check if this email is pre-registered by an admin (for attorney/paralegal)
        const users = await adminApi.getUsers();
        const adminRegisteredUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        let finalRole = requestedRole;
        let needsAdminApproval = false;
        
        // If requesting admin role, mark as pending
        if (requestedRole === 'admin') {
          finalRole = 'pending_admin';
          needsAdminApproval = true;
        } 
        // If not pre-registered by admin and trying to be attorney/paralegal, reject
        else if ((requestedRole === 'attorney' || requestedRole === 'paralegal') && !adminRegisteredUser) {
          reject(new Error(`To register as a ${requestedRole}, your email must be pre-registered by an administrator.`));
          return;
        }
        
        // Create new user with verification status and role
        const newUser = {
          email,
          password,
          isVerified: false,
          role: finalRole,
          registeredAt: new Date().toISOString(),
          name: email.split('@')[0] // Default name from email
        };
        
        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // Simulate sending verification email
        console.log(`Verification email sent to ${email}`);
        
        // If needs admin approval, simulate sending admin approval email
        if (needsAdminApproval) {
          console.log(`Admin approval request for ${email} sent to administrators`);
          toast({
            title: "Admin Approval Required",
            description: "Your admin registration request is pending approval. You'll be notified once approved.",
          });
        }
        
        // For demo purposes, we'll automatically verify the user after 5 seconds
        setTimeout(() => {
          const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const updatedUsers = users.map((u: any) => {
            if (u.email === email) {
              return { ...u, isVerified: true };
            }
            return u;
          });
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
          
          // If user is currently in the verification waiting state, notify them
          toast({
            title: "Email Verified",
            description: "Your email has been verified. You can now log in.",
          });
        }, 5000);
        
        resolve();
      } catch (error) {
        console.error("Registration error:", error);
        reject(error);
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login');
  };

  const checkUserPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    
    // Admin has access to everything
    if (currentUser.role === 'admin') return true;
    
    // Check against a single role
    if (typeof requiredRole === 'string') {
      return currentUser.role === requiredRole;
    }
    
    // Check against an array of roles
    return requiredRole.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      currentUser,
      checkUserPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
