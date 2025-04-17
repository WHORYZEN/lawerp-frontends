
import { useState } from 'react';
import { UserRole } from '@/contexts/AuthContext';
import { sendVerificationEmail, verifyEmail } from '@/services/verification-service';
import { useToast } from '@/hooks/use-toast';

export const useVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const sendVerification = async (email: string, role: UserRole) => {
    try {
      const token = await sendVerificationEmail(email, role);
      
      // For demo purposes only: Auto-verify after 5 seconds
      setTimeout(async () => {
        const verification = await verifyEmail(token);
        if (verification) {
          const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const updatedUsers = users.map((u: any) => {
            if (u.email === verification.email) {
              return { ...u, isVerified: true };
            }
            return u;
          });
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
          
          toast({
            title: "Email Verified",
            description: "Your email has been verified. You can now log in.",
          });
        }
      }, 5000);
      
      return token;
    } catch (error) {
      console.error('Error sending verification:', error);
      throw error;
    }
  };

  const verifyToken = async (token: string) => {
    setIsVerifying(true);
    try {
      const verification = await verifyEmail(token);
      if (!verification) {
        toast({
          title: "Verification Failed",
          description: "Invalid or expired verification token.",
          variant: "destructive",
        });
        return false;
      }
      
      // Update user verification status
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.email === verification.email) {
          return { ...u, isVerified: true };
        }
        return u;
      });
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully.",
      });
      return true;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    sendVerification,
    verifyToken,
    isVerifying
  };
};
