import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

import { images } from '@/constants';

export default function NotificationsScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  // Sample notifications data
  const notifications = [
    { 
      id: 1, 
      type: 'approved',
      title: 'Request Approved', 
      message: 'Dell XPS 15 Laptop request approved',
      subtext: 'Please wait Patiently for dispatch',
      time: '10 minutes ago' 
    },
    { 
      id: 2, 
      type: 'rejected',
      title: 'Request rejected', 
      message: 'Dell XPS 19 Laptop request approved',
      subtext: '',
      time: '1 hour ago' 
    },
    { 
      id: 3, 
      type: 'approved',
      title: 'Request Approved', 
      message: 'Dell XPS 19 Laptop request approved',
      subtext: 'Please wait Patiently for dispatch',
      time: 'yesterday' 
    },
    { 
      id: 4, 
      type: 'approved',
      title: 'Request Approved', 
      message: 'Dell XPS 15 Laptop request approved',
      subtext: 'Please wait Patiently for dispatch',
      time: '22/02/2025' 
    },
    { 
      id: 5, 
      type: 'approved',
      title: 'Request Approved', 
      message: 'Dell XPS 15 Laptop request approved',
      subtext: 'Please wait Patiently for dispatch',
      time: '24/01/2025' 
    },
  ];

  // For pagination functionality
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#e8eac6" barStyle="dark-content" />
      
      {/* Header with Menu, Logo and Profile */}
      <View style={styles.header}> 
        <View style={styles.logo}>
          <Image 
            source={images.Logo} 
            style={styles.logoImage}
            // defaultSource={require('@/assets/images/placeholder.png')}
          />
        </View>   
      </View>

      {/* Notifications section with dropdown */}
      <View style={styles.notificationHeader}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Recent first</Text>
          <Feather name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsContainer}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              
              <View style={styles.notificationDetails}>
                <View style={styles.bulletPoint} />
                <Text style={styles.notificationMessage}>{notification.message}</Text>
              </View>
              
              {notification.subtext && (
                <View style={styles.notificationDetails}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.notificationSubtext}>{notification.subtext}</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
        ))}
      </ScrollView>
      
      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={styles.paginationArrow} 
          onPress={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <Feather 
            name="chevron-left" 
            size={24} 
            color={currentPage === 1 ? "#ccc" : "#333"} 
          />
        </TouchableOpacity>
        
        {[...Array(totalPages)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationButton,
              currentPage === index + 1 && styles.paginationButtonActive
            ]}
            onPress={() => handlePageChange(index + 1)}
          >
            <Text style={[
              styles.paginationButtonText,
              currentPage === index + 1 && styles.paginationButtonTextActive
            ]}>
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.paginationArrow} 
          onPress={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <Feather 
            name="chevron-right" 
            size={24} 
            color={currentPage === totalPages ? "#ccc" : "#333"} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7e8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e8eac6',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    flex: 1,
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 60,
    resizeMode: 'contain',
  },
  notificationIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#d13838',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  notificationsContainer: {
    marginHorizontal: 20,
    flex: 1,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginRight: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  notificationSubtext: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  paginationArrow: {
    padding: 10,
  },
  paginationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  paginationButtonActive: {
    backgroundColor: '#0d1a31',
  },
  paginationButtonText: {
    fontSize: 16,
    color: '#666',
  },
  paginationButtonTextActive: {
    color: '#fff',
  },
});