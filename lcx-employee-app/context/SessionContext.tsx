import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

type SessionContextType = {
  session: Session | null;
  loading: boolean;
  onboardingComplete: boolean;
  setOnboardingComplete: (value: boolean) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const fetchSessionAndOnboardingStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      const hasCompletedOnboarding = await AsyncStorage.getItem('onboardingComplete');
      setOnboardingComplete(hasCompletedOnboarding === 'true');

      setLoading(false);
    };

    fetchSessionAndOnboardingStatus();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // console.log(session);
  

  return (
    <SessionContext.Provider value={{ session, loading, onboardingComplete, setOnboardingComplete }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
