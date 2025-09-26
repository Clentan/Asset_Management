import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) 
      { // Redirect if logged in
        router.push("/(app)/Profile"); 
      } // Redirect to login page
      else { router.push("/(auth)/Auth"); }
      
      setLoading(false);
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) 
      { // Redirect after login
        router.push("/(app)/Profile"); 
      } // Redirect after logout
      else { router.push("/(auth)/Auth"); }
    });

    // Cleanup listener
    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null; // No UI needed, only navigation logic
}
