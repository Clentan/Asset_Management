import { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Button, Input, Avatar, Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

const Profile = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // User info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

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
        .from("users")
        .select("first_name, last_name, phone, role")
        .eq("userId", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhone(data.phone);
        setRole(data.role); // Read-only
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async () => {
    try {
      setUpdating(true);
      const { user } = session!;
      if (!user) throw new Error("No user found!");
      
      // Basic validation
      if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
        Alert.alert("Please fill in all required fields");
        return;
      }

      const { error } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        })
        .eq("userId", user.id);

      if (error) throw error;
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Sign Out", 
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace("/(auth)/Auth");
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Our support team is available Monday-Friday 9am-5pm",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Email Support",
          onPress: () => {
            // Add email support functionality here
            Alert.alert("Email sent to support team");
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#aabb44" />
      </View>
    );
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <ImageBackground 
      source={{ uri: 'https://via.placeholder.com/1000x2000/e9f0d1/e9f0d1' }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Icon name="log-out" type="feather" size={20} color="#555" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <Avatar
                size={100}
                rounded
                title={initials}
                containerStyle={styles.avatar}
                titleStyle={{ color: 'white', fontSize: 36 }}
              />
              <Text style={styles.userName}>{firstName} {lastName}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{role}</Text>
              </View>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Account Information</Text>
              </View>
              
              <Input
                label="Email"
                value={session?.user?.email || ''}
                disabled
                leftIcon={<Icon name="mail" type="feather" size={18} color="#888" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                disabledInputStyle={styles.disabledInput}
              />
              
              <View style={styles.nameRow}>
                <Input
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  leftIcon={<Icon name="user" type="feather" size={18} color="#888" />}
                  labelStyle={styles.inputLabel}
                  containerStyle={[styles.inputContainer, styles.halfInput]}
                  inputContainerStyle={styles.input}
                  placeholder="Enter first name"
                  autoCapitalize="words"
                />
                
                <Input
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  labelStyle={styles.inputLabel}
                  containerStyle={[styles.inputContainer, styles.halfInput]}
                  inputContainerStyle={styles.input}
                  placeholder="Enter last name"
                  autoCapitalize="words"
                />
              </View>
              
              <Input
                label="Phone"
                value={phone}
                onChangeText={(text) => {
                  // Basic phone formatting
                  const cleaned = text.replace(/[^0-9]/g, '');
                  let formatted = cleaned;
                  
                  if (cleaned.length > 0) {
                    if (cleaned.length <= 3) {
                      formatted = cleaned;
                    } else if (cleaned.length <= 6) {
                      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
                    } else {
                      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
                    }
                  }
                  
                  setPhone(formatted);
                }}
                leftIcon={<Icon name="phone" type="feather" size={18} color="#888" />}
                keyboardType="phone-pad"
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                placeholder="000-000-0000"
                maxLength={12} // 10 digits + 2 hyphens
              />
              
              <Input
                label="Role"
                value={role}
                disabled
                leftIcon={<Icon name="shield" type="feather" size={18} color="#888" />}
                labelStyle={styles.inputLabel}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                disabledInputStyle={styles.disabledInput}
              />
              
              <Button
                title="Update Profile"
                onPress={updateProfile}
                loading={updating}
                disabled={updating}
                buttonStyle={styles.updateButton}
                titleStyle={styles.buttonTitle}
                containerStyle={styles.buttonContainer}
                loadingProps={{ color: 'white' }}
              />
            </View>
            
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Icon name="info" type="feather" size={24} color="#aabb44" />
                <Text style={styles.cardTitle}>Need Help?</Text>
                <Text style={styles.cardText}>Contact support if you need assistance with your account</Text>
                <Button
                  title="Contact Support"
                  type="outline"
                  buttonStyle={styles.cardButton}
                  titleStyle={{ color: '#aabb44', fontSize: 14 }}
                  onPress={handleContactSupport}
                />
              </View>
            </View>

            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Icon name="lock" type="feather" size={24} color="#aabb44" />
                <Text style={styles.cardTitle}>Security</Text>
                <Text style={styles.cardText}>Manage password and security settings</Text>
                <Button
                  title="Change Password"
                  type="outline"
                  buttonStyle={styles.cardButton}
                  titleStyle={{ color: '#aabb44', fontSize: 14 }}
                  onPress={() => {
                    Alert.alert("Feature Coming Soon", "Password management will be available in our next update.");
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e9f0d1', // Fallback color
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutButton: {
    padding: 8,
  },
  profileContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  avatar: {
    backgroundColor: '#aabb44',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#333',
  },
  roleBadge: {
    backgroundColor: '#e9f0d1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  roleText: {
    color: '#7a8c3c',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  inputLabel: {
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  inputContainer: {
    paddingHorizontal: 0,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  disabledInput: {
    backgroundColor: '#eee',
    color: '#888',
    opacity: 0.8,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },
  updateButton: {
    backgroundColor: '#aabb44',
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonTitle: {
    fontWeight: '600',
  },
  cardContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  cardText: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  cardButton: {
    borderColor: '#aabb44',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default Profile;