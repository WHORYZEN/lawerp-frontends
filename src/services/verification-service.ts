import { UserRole } from '@/contexts/AuthContext';
import { sendEmail } from '@/lib/supabase/email-service';

export interface VerificationRequest {
  email: string;
  role: UserRole;
  timestamp: string;
}

// Admin configuration
export const ADMIN_EMAIL = 'kanishk.shukla@mynxsoftwares.com';

// Store verification requests in Supabase
const generateVerificationToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

export const sendVerificationEmail = async (email: string, role: UserRole): Promise<string> => {
  const verificationToken = generateVerificationToken();
  
  // Store verification request in Supabase
  const { data, error } = await supabase
    .from('verification_requests')
    .insert([{
      token: verificationToken,
      email,
      role,
      timestamp: new Date().toISOString()
    }]);

  if (error) throw error;
  
  // Send verification email
  await sendEmail({
    type: 'verification',
    to: email,
    data: {
      verificationUrl: `/verify-email?token=${verificationToken}`,
      role
    }
  });
  
  // If this is a pending admin request, send notification to admin
  if (role === 'pending_admin') {
    await sendEmail({
      type: 'admin_request',
      to: ADMIN_EMAIL,
      data: {
        role: 'pending_admin'
      }
    });
  }
  
  return verificationToken;
};

export const verifyEmail = async (token: string): Promise<VerificationRequest | null> => {
  // Get verification request from Supabase
  const { data: verification, error } = await supabase
    .from('verification_requests')
    .select('*')
    .eq('token', token)
    .single();
  
  if (error || !verification) return null;
  
  // Check if token is expired (24 hours)
  const tokenDate = new Date(verification.timestamp);
  const now = new Date();
  const hoursSinceGenerated = (now.getTime() - tokenDate.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceGenerated > 24) {
    // Delete expired token
    await supabase
      .from('verification_requests')
      .delete()
      .eq('token', token);
    return null;
  }
  
  // Delete used token
  await supabase
    .from('verification_requests')
    .delete()
    .eq('token', token);
  
  return verification;
};

export const sendAdminApprovalNotification = async (approvedEmail: string, approved: boolean): Promise<void> => {
  await sendEmail({
    type: 'admin_approval',
    to: approvedEmail,
    data: {
      approved
    }
  });
};
