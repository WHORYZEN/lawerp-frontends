
import { UserRole } from '@/contexts/AuthContext';

export interface VerificationRequest {
  email: string;
  role: UserRole;
  timestamp: string;
}

// In a real app, this would be stored in a database
const verificationStore = new Map<string, VerificationRequest>();

export const generateVerificationToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

export const sendVerificationEmail = (email: string, role: UserRole): string => {
  const verificationToken = generateVerificationToken();
  
  // Store verification request
  verificationStore.set(verificationToken, {
    email,
    role,
    timestamp: new Date().toISOString()
  });
  
  // Simulate sending email
  console.log('=====================================');
  console.log('Email Verification Link Sent');
  console.log('To:', email);
  console.log('Token:', verificationToken);
  console.log('Role:', role);
  console.log('Verify at: /verify-email?token=' + verificationToken);
  console.log('=====================================');
  
  return verificationToken;
};

export const verifyEmail = (token: string): VerificationRequest | null => {
  const verification = verificationStore.get(token);
  
  if (!verification) {
    return null;
  }
  
  // Check if token is expired (24 hours)
  const tokenDate = new Date(verification.timestamp);
  const now = new Date();
  const hoursSinceGenerated = (now.getTime() - tokenDate.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceGenerated > 24) {
    verificationStore.delete(token);
    return null;
  }
  
  // Clear the used token
  verificationStore.delete(token);
  
  return verification;
};

