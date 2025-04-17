
/**
 * Helper utility to safely access environment variables in Vite
 */

export const getEnv = (key: string): string => {
  return import.meta.env[`VITE_${key}`] || '';
};

// Default fallback values for local development
const DEFAULT_SUPABASE_URL = 'https://your-project-id.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'your-anon-key';

// Export Supabase environment variables with fallbacks
export const SUPABASE_URL = getEnv('SUPABASE_URL') || DEFAULT_SUPABASE_URL;
export const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_ANON_KEY;
