
import { createClient } from '@supabase/supabase-js';
import { UserRole } from '@/contexts/AuthContext';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/env';

// Create Supabase client with validation
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

// Validate URL before creating client
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('Invalid Supabase URL. Please set a valid VITE_SUPABASE_URL in your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
