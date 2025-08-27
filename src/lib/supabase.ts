import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eiwthhhwjxgplrlrxmhv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpd3RoaGh3anhncGxybHJ4bWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTUzMTksImV4cCI6MjA3MVg5MTMxOX0.iE25tGw9okgHRrOMqlF7rJRXnPbaTfa06xwnjr-RnKw';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export { supabaseUrl, supabaseAnonKey };