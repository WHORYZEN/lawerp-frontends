import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useVerification } from '@/hooks/use-verification';
import { adminApi } from '@/backend';
import { ADMIN_EMAIL } from '@/services/verification-service';

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
  const { sendVerification } = useVerification();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      
      const userData = localStorage.getItem('userData');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const users = await adminApi.getUsers();
        const adminRegisteredUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
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
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const existingUser = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
          reject(new Error('User with this email already exists'));
          return;
        }
        
        const users = await adminApi.getUsers();
        const adminRegisteredUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        let finalRole = requestedRole;
        let needsAdminApproval = false;
        
        if (requestedRole === 'admin') {
          finalRole = 'pending_admin';
          needsAdminApproval = true;
        } 
        else if ((requestedRole === 'attorney' || requestedRole === 'paralegal') && !adminRegisteredUser) {
          reject(new Error(`To register as a ${requestedRole}, your email must be pre-registered by an administrator.`));
          return;
        }
        
        const newUser = {
          email,
          password,
          isVerified: false,
          role: finalRole,
          registeredAt: new Date().toISOString(),
          name: email.split('@')[0]
        };
        
        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        sendVerification(email, finalRole);
        
        if (needsAdminApproval) {
          console.log(`Admin approval request sent to ${ADMIN_EMAIL}`);
          toast({
            title: "Admin Approval Required",
            description: `Your admin registration request has been sent to ${ADMIN_EMAIL}. You'll be notified once approved.`,
          });
        }
        
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
    
    if (currentUser.role === 'admin') return true;
    
    if (typeof requiredRole === 'string') {
      return currentUser.role === requiredRole;
    }
    
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
