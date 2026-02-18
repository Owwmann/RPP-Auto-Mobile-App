/**
* Supabase Configuration Validator
* Ensures Supabase is properly configured before app starts
*/

export function validateSupabaseUrl(url: string | undefined): string {
  if (!url) {
    throw new Error('supabaseUrl is required. Please check your .env file.');
  }
 
  if (!url.startsWith('https://')) {
    throw new Error('supabaseUrl must start with https://');
  }
 
  if (!url.includes('supabase.co')) {
    throw new Error('supabaseUrl must be a valid Supabase URL');
  }
 
  return url;
}

export const SUPABASE_URL = validateSupabaseUrl(
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://gfhthbmbgoxqqbzxnauv.supabase.co'
);

export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmaHRoYm1iZ294cXFienhuYXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzExMjQsImV4cCI6MjA3NTA0NzEyNH0.7cFIaTcDupirdhkHlMgcm7eEUfRMwroVGn1QH4wqwz4';
