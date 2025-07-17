import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface VoltMarketProfile {
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

interface VoltMarketAuthContextType {
  user: User | null;
  session: Session | null;
  profile: VoltMarketProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (updates: Partial<VoltMarketProfile>) => Promise<any>;
  createProfile: (userId: string, userData: any) => Promise<any>;
  resendEmailVerification: () => Promise<any>;
}

const VoltMarketAuthContext = createContext<VoltMarketAuthContextType | undefined>(undefined);

export const VoltMarketAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<VoltMarketProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('voltmarket_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.log('Profile fetch error:', error);
        return null;
      }
      
      return profileData;
    } catch (err) {
      console.log('Unexpected error fetching profile:', err);
      return null;
    }
  };

  const createProfile = async (userId: string, userData: {
    role: 'buyer' | 'seller';
    seller_type?: 'site_owner' | 'broker' | 'realtor' | 'equipment_vendor';
    company_name?: string;
    phone_number?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('voltmarket_profiles')
        .insert({
          user_id: userId,
          role: userData.role,
          seller_type: userData.seller_type,
          company_name: userData.company_name,
          phone_number: userData.phone_number,
          is_id_verified: false,
          is_email_verified: false,
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Profile creation error:', error);
        return { error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected profile creation error:', err);
      return { error: err as Error };
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            if (mounted) {
              const profileData = await fetchProfile(session.user.id);
              if (mounted) {
                setProfile(profileData);
                setLoading(false);
              }
            }
          }, 0);
        } else {
          if (mounted) {
            setProfile(null);
            setLoading(false);
          }
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: {
    role: 'buyer' | 'seller';
    seller_type?: 'site_owner' | 'broker' | 'realtor' | 'equipment_vendor';
    company_name?: string;
    phone_number?: string;
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/voltmarket/auth`,
          data: {
            role: userData.role,
            company_name: userData.company_name
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      if (data.user) {
        const profileResult = await createProfile(data.user.id, userData);
        
        if (profileResult.error) {
          return { error: profileResult.error };
        }
        
        setProfile(profileResult.data);
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected signup error:', err);
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    try {
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updateProfile = async (updates: Partial<VoltMarketProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { data, error } = await supabase
        .from('voltmarket_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Profile update error:', error);
        return { data: null, error };
      }

      if (data) {
        setProfile(data);
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected profile update error:', err);
      return { data: null, error: err as Error };
    }
  };

  const resendEmailVerification = async () => {
    if (!user?.email) return { error: new Error('No user found') };
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/voltmarket/auth`
        }
      });
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
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
    resendEmailVerification,
  };

  return (
    <VoltMarketAuthContext.Provider value={value}>
      {children}
    </VoltMarketAuthContext.Provider>
  );
};

export const useVoltMarketAuth = () => {
  const context = useContext(VoltMarketAuthContext);
  if (context === undefined) {
    throw new Error('useVoltMarketAuth must be used within a VoltMarketAuthProvider');
  }
  return context;
};