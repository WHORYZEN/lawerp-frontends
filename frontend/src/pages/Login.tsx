
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const Login = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [verificationSent, setVerificationSent] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated, register } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const checkPasswordStrength = (pass) => {
    const requirements = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };
    
    setPasswordRequirements(requirements);
    
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength(metRequirements * 20);
    
    return metRequirements >= 4;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!fullName || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!checkPasswordStrength(password)) {
      toast({
        title: "Error",
        description: "Password does not meet the security requirements",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await register(fullName, email, password);
      setVerificationSent(true);
      toast({
        title: "Success",
        description: "Registration successful! Please check your email for verification.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await login("google@example.com", "google-auth");
      toast({
        title: "Success",
        description: "You have successfully logged in with Google",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in with Google.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 20) return "Very Weak";
    if (passwordStrength <= 40) return "Weak";
    if (passwordStrength <= 60) return "Medium";
    if (passwordStrength <= 80) return "Strong";
    return "Very Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 20) return "bg-red-500";
    if (passwordStrength <= 40) return "bg-orange-500";
    if (passwordStrength <= 60) return "bg-yellow-500";
    if (passwordStrength <= 80) return "bg-green-400";
    return "bg-green-600";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
          <img
              src="/2.png"
              alt="LYZ logo"
              className=" rounded-md object-cover"
              />
          </div>
          {/* <CardTitle className="text-2xl font-bold text-center"></CardTitle> */}
          {/* <CardDescription className="text-center text-xs text-gray-500">
            LAW EMR
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a className="text-sm text-lawfirm-light-blue hover:underline" href="#">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-lawfirm-light-blue hover:bg-lawfirm-light-blue/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <FcGoogle className="mr-2 h-5 w-5" />
                  Google Account
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="mt-0">
              {verificationSent ? (
                <div className="space-y-4 text-center py-6">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="text-lg font-semibold">Verification Email Sent</h3>
                  <p className="text-gray-500">
                    Please check your email to complete the registration process.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("login")}
                  >
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input 
                      id="full-name" 
                      type="text" 
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password" 
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        checkPasswordStrength(e.target.value);
                      }}
                      required
                    />
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">{getPasswordStrengthLabel()}</span>
                        <span className="text-xs">{passwordStrength}%</span>
                      </div>
                      <Progress 
                        value={passwordStrength} 
                        className={`h-1.5 ${getPasswordStrengthColor()}`} 
                      />
                      
                      <div className="grid grid-cols-1 gap-1 mt-2">
                        <div className="flex items-center gap-1 text-xs">
                          <span className={passwordRequirements.length ? "text-green-500" : "text-gray-400"}>✓</span>
                          <span>At least 8 characters</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className={passwordRequirements.uppercase ? "text-green-500" : "text-gray-400"}>✓</span>
                          <span>At least 1 uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className={passwordRequirements.lowercase ? "text-green-500" : "text-gray-400"}>✓</span>
                          <span>At least 1 lowercase letter</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className={passwordRequirements.number ? "text-green-500" : "text-gray-400"}>✓</span>
                          <span>At least 1 number</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className={passwordRequirements.special ? "text-green-500" : "text-gray-400"}>✓</span>
                          <span>At least 1 special character</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {password && confirmPassword && password !== confirmPassword && (
                      <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Passwords do not match</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-lawfirm-light-blue hover:bg-lawfirm-light-blue/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <div>
            {activeTab === "login" ? (
              <>
                Don't have an account?{" "}
                <a 
                  className="text-lawfirm-light-blue hover:underline cursor-pointer" 
                  onClick={() => setActiveTab("register")}
                >
                  Create one now
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a 
                  className="text-lawfirm-light-blue hover:underline cursor-pointer" 
                  onClick={() => setActiveTab("login")}
                >
                  Sign in
                </a>
              </>
            )}
          </div>
          <div>© 2023 LYZ Law Firm. All rights reserved.</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
