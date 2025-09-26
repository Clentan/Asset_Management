import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const PendingApprovalsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Upper curved background */}
      <View style={styles.upperCurve} />
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        {/* 
            <Image
                source={require('./assets/limpopo-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            /> 
        */}
        <View style={styles.logoTextContainer}>
          <Text style={styles.logoTextMain}>LIMPOPO</Text>
          <Text style={styles.logoTextSub}>CONNEXION</Text>
          <Text style={styles.tagline}>building a future knowledge society</Text>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>pending approvals</Text>
        <Text style={styles.subTitle}>Full 3 request waiting</Text>
        
        {/* Pending Approvals Section */}
        <View style={styles.requestCard}>
          <Text style={styles.itemName}>MacBoo-k Pro</Text>
          <View style={styles.requestDetails}>
            <Text style={styles.detailText}>From: Thabo Mokoena</Text>
          </View>
          <View style={styles.requestDetails}>
            <Text style={styles.detailText}>To: Marketing (Floor 3)</Text>
            <Text style={styles.timeText}>submited yesterday</Text>
          </View>
        </View>
        
        <View style={styles.requestCard}>
          <Text style={styles.itemName}>iphone 6</Text>
          <View style={styles.requestDetails}>
            <Text style={styles.detailText}>From: Thabo Mokoena</Text>
          </View>
          <View style={styles.requestDetails}>
            <Text style={styles.detailText}>To: Marketing (Floor 3)</Text>
            <Text style={styles.timeText}>submitted today</Text>
          </View>
        </View>
        
        {/* Recent Approvals Section */}
        <Text style={[styles.sectionTitle, {marginTop: 30}]}>Recent Approvals</Text>
        
        <View style={styles.requestCard}>
          <View style={styles.requestDetails}>
            <Text style={styles.itemName}>Chair</Text>
            <TouchableOpacity style={styles.approveButton}>
              <Text style={styles.approveButtonText}>approved</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timeText}>approved 2 hours ago</Text>
        </View>
        
        <View style={styles.requestCard}>
          <View style={styles.requestDetails}>
            <Text style={styles.itemName}>Laptop</Text>
            <TouchableOpacity style={styles.rejectButton}>
              <Text style={styles.rejectButtonText}>reject</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timeText}>rejected 2 hours ago</Text>
        </View>
      </ScrollView>
      
      {/* Lower curved background */}
      <View style={styles.lowerCurve} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9efc0',
  },
  upperCurve: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'white',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    transform: [{scaleX: 1.5}],
    zIndex: -1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  logoTextContainer: {
    alignItems: 'center',
  },
  logoTextMain: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
  },
  logoTextSub: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a3bb2e',
    marginTop: -8,
  },
  tagline: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 20,
    color: '#999',
    marginBottom: 20,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
  },
  timeText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  approveButton: {
    backgroundColor: '#b5cd32',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  approveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  rejectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  lowerCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: 'white',
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    transform: [{scaleX: 1.5}],
    zIndex: -1,
  },
});

export default PendingApprovalsScreen;