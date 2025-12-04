import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  supabaseUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (data) {
        return {
          name: data.name,
          currentRole: data.current_role,
          currentBand: data.current_band,
          nmcPin: data.nmc_pin || '',
          revalidationDate: data.revalidation_date || ''
        };
      }
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check for existing session with timeout
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication...');
        
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || supabaseUrl === '' || supabaseKey === '') {
          console.error('❌ Supabase not configured!');
          console.error('   Check .env.local file exists and has:');
          console.error('   VITE_SUPABASE_URL=https://xxx.supabase.co');
          console.error('   VITE_SUPABASE_ANON_KEY=eyJ...');
          console.error('   Then restart dev server with: npm run dev');
          setIsLoading(false);
          setIsAuthenticated(false);
          return;
        }

        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth check timeout')), 10000)
        );

        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Session found, fetching profile...');
          setSupabaseUser(session.user);
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
            console.log('✅ Profile loaded, user authenticated');
          } else {
            console.warn('⚠️ Profile not found, but user is authenticated');
          }
        } else {
          console.log('ℹ️ No active session');
        }
      } catch (error: any) {
        console.error('❌ Error in checkAuth:', error);
        if (error.message === 'Auth check timeout') {
          console.error('⏱️ Authentication check timed out. Check Supabase connection.');
        }
      } finally {
        setIsLoading(false);
        console.log('🏁 Auth check complete');
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        if (session?.user) {
          setSupabaseUser(session.user);
          setIsAuthenticated(true); // Set immediately, don't wait for profile
          
          // Fetch profile in background (non-blocking)
          fetchUserProfile(session.user.id)
            .then(profile => {
              if (profile) {
                setUser(profile);
                console.log('✅ Profile loaded from auth state change');
              } else {
                console.warn('⚠️ Profile not found - will be created by trigger');
              }
            })
            .catch(error => {
              console.error('❌ Error fetching profile (non-blocking):', error);
            });
        } else {
          setSupabaseUser(null);
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false); // Always set loading to false
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('🔐 Attempting login...');
    try {
      console.log('📧 Signing in with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        setIsLoading(false);
        throw error;
      }

      if (data.user) {
        console.log('✅ Login successful, user ID:', data.user.id);
        setSupabaseUser(data.user);
        setIsAuthenticated(true); // Set authenticated immediately
        setIsLoading(false); // Stop loading immediately - don't wait for profile
        console.log('🏁 Login process complete - user authenticated');
        
        // Try to fetch profile in background (non-blocking)
        fetchUserProfile(data.user.id)
          .then(profile => {
            if (profile) {
              setUser(profile);
              console.log('✅ Profile loaded');
            } else {
              console.warn('⚠️ Profile not found - will be created by trigger');
            }
          })
          .catch(profileError => {
            console.error('❌ Profile fetch failed (non-blocking):', profileError);
            // Profile might not exist yet - that's OK, trigger will create it
          });
      } else {
        setIsLoading(false);
        throw new Error('No user data returned');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setIsLoading(false);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            current_role: 'Staff Nurse',
            current_band: 'Band 5'
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setSupabaseUser(data.user);
        // Profile will be created by the trigger, but we can fetch it
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
    setUser(profile);
    setIsAuthenticated(true);
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    } finally {
    setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    setUser(null);
      setSupabaseUser(null);
    setIsAuthenticated(false);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, supabaseUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};