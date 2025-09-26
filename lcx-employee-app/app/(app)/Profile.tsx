import { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

const Profile = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // User info state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  
  // Read-only fields
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [dateJoined, setDateJoined] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) getProfile(session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        getProfile(session);
      } else {
        router.replace("/(auth)/Auth"); // Redirect if signed out
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function getProfile(session: Session) {
    try {
      setLoading(true);
      const { user } = session;
      if (!user) throw new Error("No user found!");

      const { data, error } = await supabase
        .from("employees")
        .select(`
          full_name, employee_id, department, position, 
          office_location, date_joined, employment_status,
          phone_number, address, emergency_contact_name, 
          emergency_contact_phone, preferred_language,
          is_first_login
        `)
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setFullName(data.full_name || '');
        setPhoneNumber(data.phone_number || '');
        setAddress(data.address || '');
        setEmergencyContactName(data.emergency_contact_name || '');
        setEmergencyContactPhone(data.emergency_contact_phone || '');
        setPreferredLanguage(data.preferred_language || 'English');
        
        // Read-only fields
        setEmployeeId(data.employee_id);
        setDepartment(data.department);
        setPosition(data.position);
        setOfficeLocation(data.office_location);
        setDateJoined(data.date_joined);
        setEmploymentStatus(data.employment_status);
        
        // Check if this is user's first login
        setIsFirstLogin(data.is_first_login);
        
        // If first login, show welcome message
        if (data.is_first_login) {
          Alert.alert(
            "Welcome!",
            "Please complete your profile information."
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { user } = session!;
      if (!user) throw new Error("No user found!");

      const { error } = await supabase
        .from("employees")
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          address: address,
          emergency_contact_name: emergencyContactName,
          emergency_contact_phone: emergencyContactPhone,
          preferred_language: preferredLanguage,
          is_first_login: false, // Set to false after profile update
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (error) throw error;
      Alert.alert("Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/Auth");
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Employee Profile</Text>
      
      {/* Read-only fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Information</Text>
        <Input label="Email" value={session?.user?.email || ''} disabled />
        <Input label="Employee ID" value={employeeId} disabled />
        <Input label="Department" value={department} disabled />
        <Input label="Position" value={position} disabled />
        <Input label="Office Location" value={officeLocation} disabled />
        <Input label="Date Joined" value={dateJoined} disabled />
        <Input label="Employment Status" value={employmentStatus} disabled />
      </View>
      
      {/* Editable fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <Input 
          label="Full Name" 
          value={fullName} 
          onChangeText={setFullName}
          placeholder="Enter your full name"
        />
        <Input 
          label="Phone Number" 
          value={phoneNumber} 
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
        <Input 
          label="Address" 
          value={address} 
          onChangeText={setAddress}
          placeholder="Enter your address"
          multiline
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <Input 
          label="Contact Name" 
          value={emergencyContactName} 
          onChangeText={setEmergencyContactName}
          placeholder="Enter emergency contact name"
        />
        <Input 
          label="Contact Phone" 
          value={emergencyContactPhone} 
          onChangeText={setEmergencyContactPhone}
          placeholder="Enter emergency contact phone"
          keyboardType="phone-pad"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Input 
          label="Preferred Language" 
          value={preferredLanguage} 
          onChangeText={setPreferredLanguage}
          placeholder="Enter preferred language"
        />
      </View>

      <Button 
        title={isFirstLogin ? "Complete Profile Setup" : "Update Profile"} 
        onPress={updateProfile} 
        disabled={loading}
        buttonStyle={styles.updateButton}
      />

      <View style={styles.divider} />

      <Button 
        title="Sign Out" 
        onPress={handleSignOut}
        buttonStyle={styles.signOutButton}
      />
      
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    paddingLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#2089dc',
    borderRadius: 10,
    paddingVertical: 12,
  },
  signOutButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    paddingVertical: 12,
  },
  bottomPadding: {
    height: 40,
  }
});