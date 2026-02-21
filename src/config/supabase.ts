import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gfhthbmbgoxqqbzxnauv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmaHRoYm1iZ294cXFienhuYXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzExMjQsImV4cCI6MjA3NTA0NzEyNH0.7cFIaTcDupirdhkHlMgcm7eEUfRMwroVGn1QH4wqwz4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { supabaseUrl, supabaseAnonKey };
