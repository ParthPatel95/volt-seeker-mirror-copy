import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface VoltMarketProfile {
  id: string;
  user_id: string;
  role?: 'buyer' | 'seller' | 'admin';
  seller_type?: 'site_owner' | 'broker' | 'realtor' | 'equipment_vendor';
  company_name?: string;
  phone_number?: string;
  profile_image_url?: string;
  bio?: string;
  website?: string;
  linkedin_url?: string;
  contact_person?: string;
  business_license?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  investment_capacity_usd?: number;
  preferred_investment_types?: string[];
  investment_timeline?: string;
  accredited_investor?: boolean;
  is_id_verified: boolean;
  is_email_verified: boolean;
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
  refreshProfile: () => Promise<void>;
}

const VoltMarketAuthContext = createContext<VoltMarketAuthContextType | undefined>(undefined);

export const VoltMarketAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<VoltMarketProfile | null>(null);
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
      // For signup, we need to ensure the profile is created with proper auth context
      const { data, error } = await supabase
        .from('gridbazaar_profiles')
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to avoid potential recursive calls
          setTimeout(async () => {
            if (mounted) {
              const profileData = await fetchProfile(session.user.id);
              if (mounted) {
                setProfile({
                  ...profileData,
                  role: (profileData.role as any) || 'buyer'
                } as any);
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

    // Check for existing session only once
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        console.log('Initial session check:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile({
              ...profileData,
              role: (profileData?.role as any) || 'buyer'
            } as any);
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
  }, []); // Empty dependency array to run only once

  const signUp = async (email: string, password: string, userData: {
    role: 'buyer' | 'seller';
    seller_type?: 'site_owner' | 'broker' | 'realtor' | 'equipment_vendor';
    company_name?: string;
    phone_number?: string;
  }) => {
    try {
      console.log('Starting signup process...');
      
      // Sign up user with Supabase auth (no email confirmation - we handle it ourselves)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
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
      
      console.log('User created:', data.user?.id);

      if (data.user) {
        // Wait a moment for the auth session to be fully established
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Create profile using the edge function which has service role access
        console.log('Creating profile for user:', data.user.id);
        
        try {
          const { data: functionData, error: functionError } = await supabase.functions.invoke('create-voltmarket-profile', {
            body: {
              user_id: data.user.id,
              role: userData.role,
              seller_type: userData.seller_type,
              company_name: userData.company_name,
              phone_number: userData.phone_number
            }
          });
          
          if (functionError) {
            console.error('Edge function error:', functionError);
            return { error: functionError };
          }
          
          console.log('Profile created successfully via edge function:', functionData);
          setProfile({
            ...functionData,
            role: (functionData?.role as 'buyer' | 'seller' | 'admin') || 'buyer'
          } as VoltMarketProfile);
          
        } catch (edgeFunctionError) {
          console.error('Edge function failed, trying direct insert:', edgeFunctionError);
          
          // Fallback: Try direct profile creation (this should work if auth session is established)
          const profileResult = await createProfile(data.user.id, userData);
          
          if (profileResult.error) {
            console.error('Direct profile creation also failed:', profileResult.error);
            return { error: profileResult.error };
          }
          
          console.log('Profile created successfully via direct insert');
          setProfile({
            ...profileResult.data,
            role: (profileResult.data?.role as 'buyer' | 'seller' | 'admin') || 'buyer'
          } as VoltMarketProfile);
        }
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
    console.log('Attempting to sign out...');
    try {
      // Clear local state FIRST to ensure immediate UI update
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        // Even if there's an error, we've cleared local state
      } else {
        console.log('Sign out successful');
      }
      
      return { error };
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      return { error: err as Error };
    }
  };

  const updateProfile = async (updates: Partial<VoltMarketProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { data, error } = await supabase
        .from('gridbazaar_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Profile update error:', error);
        return { data: null, error };
      }

      if (data) {
        console.log('Profile updated successfully:', data);
        setProfile({
          ...data,
          role: (data?.role as any) || 'buyer'
        } as any);
      }

      // Always refresh profile data from database to ensure we have latest
      const freshProfile = await fetchProfile(user.id);
      if (freshProfile) {
        console.log('Setting fresh profile data:', freshProfile);
        console.log('Email verification status:', freshProfile.is_email_verified);
        console.log('Full profile object:', JSON.stringify(freshProfile, null, 2));
        
        // Force a complete profile state refresh
        setProfile({
          ...freshProfile,
          role: (freshProfile?.role as any) || 'buyer'
        } as any);
      } else {
        console.log('No profile found during refresh');
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected profile update error:', err);
      return { data: null, error: err as Error };
    }
  };

  const resendEmailVerification = async () => {
    if (!user?.email || !user?.id) return { error: new Error('No user found') };

    try {
      console.log('Sending verification email using Resend...');
      
      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email: user.email,
          user_id: user.id,
          is_resend: true
        }
      });

      if (error) {
        console.error('Error sending verification email:', error);
        return { error };
      }

      console.log('Verification email sent successfully:', data);
      return { error: null };
    } catch (err) {
      console.error('Error sending verification email:', err);
      return { error: err as Error };
    }
  };

  const refreshProfile = async () => {
    if (!user?.id) return;
    
    try {
      console.log('Manually refreshing profile...');
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile({
          ...profileData,
          role: (profileData?.role as any) || 'buyer'
        } as VoltMarketProfile);
        console.log('Profile refreshed successfully:', profileData);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
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
    refreshProfile,
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