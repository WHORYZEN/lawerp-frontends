
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MONGODB_URI: string;
  readonly VITE_MONGODB_DB_NAME: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
