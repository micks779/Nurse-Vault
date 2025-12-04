import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase URL and Anon Key must be set in environment variables');
  console.error('   Create a .env.local file with:');
  console.error('   VITE_SUPABASE_URL=https://xxx.supabase.co');
  console.error('   VITE_SUPABASE_ANON_KEY=eyJ...');
  console.error('   Then restart the dev server!');
} else {
  console.log('✅ Supabase configured');
  console.log('   URL:', supabaseUrl.substring(0, 30) + '...');
}

// Create Supabase client with error handling
let supabase;
try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '') {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    console.log('✅ Supabase client created');
  } else {
    console.warn('⚠️ Supabase credentials missing - creating placeholder client');
    // Create placeholder to prevent crashes, but it won't work
    supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
  }
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error);
  // Create a dummy client to prevent crashes
  supabase = createClient('https://dummy.supabase.co', 'dummy-key');
}

export { supabase };

