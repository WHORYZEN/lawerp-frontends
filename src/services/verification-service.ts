import { UserRole } from '@/contexts/AuthContext';

export interface VerificationRequest {
  email: string;
  role: UserRole;
  timestamp: string;
}

// Admin configuration
export const ADMIN_EMAIL = 'kanishk.shukla@mynxsoftwares.com';

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

  // If this is a pending admin request, simulate sending notification to admin
  if (role === 'pending_admin') {
    console.log('=====================================');
    console.log('Admin Approval Request Notification');
    console.log('From:', email);
    console.log('To:', ADMIN_EMAIL);
    console.log('Subject: New Admin Access Request');
    console.log('Message: A new user has requested admin access.');
    console.log('Approve at: /admin/user-approval');
    console.log('=====================================');
  }
  
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

export const sendAdminApprovalNotification = (approvedEmail: string, approved: boolean): void => {
  console.log('=====================================');
  console.log('Admin Decision Notification');
  console.log('From:', ADMIN_EMAIL);
  console.log('To:', approvedEmail);
  console.log('Subject:', approved ? 'Admin Access Approved' : 'Admin Access Denied');
  console.log('Status:', approved ? 'Your admin access request has been approved.' : 'Your admin access request has been denied.');
  console.log('=====================================');
};
