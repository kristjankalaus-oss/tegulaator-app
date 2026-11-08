import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
// Strip trailing /rest/v1 or slashes to ensure standard Supabase project URL
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !supabaseUrl.includes('placeholder-project') &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
