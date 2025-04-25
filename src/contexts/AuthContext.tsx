
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  currentUser: UserData | null;
}

interface UserData {
  name?: string;
  email: string;
  isVerified: boolean;
  role?: string;
  permissions?: string[];
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
    // For demo purposes, we'll just set isAuthenticated to true
    // In a real app, you would validate credentials with a backend service
    return new Promise<void>((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // Check if user exists in localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find((u: any) => u.email === email);

        if (user && user.password === password) {
          if (!user.isVerified) {
            reject(new Error('Email not verified. Please check your inbox.'));
            return;
          }

          const userData: UserData = {
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            role: user.role || 'staff',
            permissions: user.permissions || []
          };

          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userData', JSON.stringify(userData));
          setIsAuthenticated(true);
          setCurrentUser(userData);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        try {
          // Check if user already exists
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const existingUser = registeredUsers.find((u: any) => u.email === email);
          
          if (existingUser) {
            reject(new Error('User with this email already exists'));
            return;
          }
          
          // Create new user with verification status
          const newUser = {
            name,
            email,
            password,
            isVerified: false,
            role: 'staff', // Default role
            permissions: [], // Default no permissions
            registeredAt: new Date().toISOString()
          };
          
          registeredUsers.push(newUser);
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
          
          // Simulate sending verification email
          console.log(`Verification email sent to ${email}`);
          
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
          reject(error);
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, currentUser }}>
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
