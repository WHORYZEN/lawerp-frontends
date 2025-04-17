
/**
 * Helper utility to safely access environment variables in Vite
 */

export const getEnv = (key: string): string => {
  return import.meta.env[`VITE_${key}`] || '';
};

export const SUPABASE_URL = getEnv('SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY');
