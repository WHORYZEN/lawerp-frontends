
import { createClient } from '@supabase/supabase-js';
import { UserRole } from '@/contexts/AuthContext';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export interface EmailTemplate {
  type: 'verification' | 'admin_request' | 'admin_approval';
  to: string;
  data: {
    verificationUrl?: string;
    role?: UserRole;
    approved?: boolean;
  };
}

export const sendEmail = async (template: EmailTemplate) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { template }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
