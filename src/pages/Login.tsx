
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await register(email, password, role);
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please check your email for verification.",
      });
      setActiveTab('login');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <Helmet>
        <title>{activeTab === 'login' ? 'Login' : 'Register'} - Law ERP</title>
      </Helmet>
      
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-800">Law ERP System</h1>
          <p className="text-gray-600 mt-2">Manage your law practice efficiently</p>
        </div>
        
        <Card className="border-purple-100 shadow-lg">
          <CardHeader>
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            
              <CardContent className="px-0 pt-6 pb-0">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800">
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={loading}>
                        {loading ? 'Please wait...' : 'Sign In'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="register" className="mt-0">
                  <form onSubmit={handleRegister}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="role">Register As</Label>
                        <Select onValueChange={(value) => setRole(value as UserRole)} defaultValue="staff">
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="paralegal">Paralegal</SelectItem>
                            <SelectItem value="attorney">Attorney</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                        {(role === 'paralegal' || role === 'attorney') && (
                          <p className="text-xs text-amber-600 mt-1">
                            Note: Your email must be pre-registered by an administrator to create an account with this role.
                          </p>
                        )}
                        {role === 'admin' && (
                          <p className="text-xs text-amber-600 mt-1">
                            Note: Admin registration requires approval. Your request will be reviewed.
                          </p>
                        )}
                      </div>
                      
                      <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={loading}>
                        {loading ? 'Please wait...' : 'Create Account'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </CardHeader>
          
          <CardFooter className="flex justify-center border-t border-purple-100 pt-4">
            <p className="text-sm text-gray-600">
              {activeTab === 'login'
                ? "Don't have an account? "
                : "Already have an account? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(activeTab === 'login' ? 'register' : 'login');
                }}
                className="text-purple-600 hover:text-purple-800"
              >
                {activeTab === 'login' ? 'Sign up' : 'Sign in'}
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
