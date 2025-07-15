import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface GridBazaarProfile {
  id: string;
  user_id: string;
  role: 'buyer' | 'seller' | 'admin';
  seller_type?: 'site_owner' | 'broker' | 'realtor' | 'equipment_vendor';
  company_name?: string;
  phone_number?: string;
  is_id_verified: boolean;
  is_email_verified: boolean;
  profile_image_url?: string;
  bio?: string;
  website?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

interface GridBazaarAuthContextType {
  user: User | null;
  session: Session | null;
  profile: GridBazaarProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (updates: Partial<GridBazaarProfile>) => Promise<any>;
  createProfile: (userId: string, userData: any) => Promise<any>;
  resendEmailVerification: () => Promise<any>;
}

const GridBazaarAuthContext = createContext<GridBazaarAuthContextType | undefined>(undefined);

export const GridBazaarAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<GridBazaarProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profileData, error } = await supabase
        .from('gridbazaar_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.log('Profile fetch error:', error);
        return null;
      }

      console.log('Profile fetched successfully:', profileData);
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user || null);

          if (session?.user) {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateProfile = async (updates: Partial<GridBazaarProfile>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('gridbazaar_profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  const createProfile = async (userId: string, userData: any) => {
    const { data, error } = await supabase
      .from('gridbazaar_profiles')
      .insert({
        user_id: userId,
        ...userData
      })
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  const resendEmailVerification = async () => {
    if (!user?.email) throw new Error('No user email found');
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email
    });

    return { error };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    createProfile,
    resendEmailVerification
  };

  return (
    <GridBazaarAuthContext.Provider value={value}>
      {children}
    </GridBazaarAuthContext.Provider>
  );
};

export const useGridBazaarAuth = () => {
  const context = useContext(GridBazaarAuthContext);
  if (!context) {
    throw new Error('useGridBazaarAuth must be used within a GridBazaarAuthProvider');
  }
  return context;
};