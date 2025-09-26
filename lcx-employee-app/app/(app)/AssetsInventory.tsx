import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons, Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';

import { images } from "@/constants";
import { useAssets } from '@/context/AssetContext';

export default function AssetInventoryScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const [selectedFilter, setSelectedFilter] = useState('All...');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAssetId, setExpandedAssetId] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const { assets } = useAssets();

  // Sample assets data with more details
  // const assets = [
  //   { 
  //     id: 1, 
  //     name: 'Dell XPS 15 Laptop',
  //     status: 'Available',
  //     category: 'Computer/Laptop',
  //     serialNumber: 'DX15-7890-A',
  //     location: 'IT Department',
  //     condition: 'New',
  //     acquisitionDate: '15/01/2025',
  //     lastUpdated: '10 minutes ago' 
  //   },
  //   { 
  //     id: 2, 
  //     name: 'Dell XPS 19 Laptop',
  //     status: 'Assigned',
  //     category: 'Computer/Laptop',
  //     serialNumber: 'DX19-5432-B',
  //     location: 'Finance Department',
  //     condition: 'Good',
  //     acquisitionDate: '20/12/2024',
  //     lastUpdated: '1 hour ago' 
  //   },
  //   { 
  //     id: 3, 
  //     name: 'HP Laser Printer',
  //     status: 'Available',
  //     category: 'Printer/Scanner',
  //     serialNumber: 'HPL-2345-C',
  //     location: 'Admin Office',
  //     condition: 'Good',
  //     acquisitionDate: '05/11/2024',
  //     lastUpdated: '2 days ago' 
  //   },
  //   { 
  //     id: 4, 
  //     name: 'Samsung S22 Ultra',
  //     status: 'Maintenance',
  //     category: 'Mobile Device',
  //     serialNumber: 'SS22-1234-D',
  //     location: 'IT Support',
  //     condition: 'Under Repair',
  //     acquisitionDate: '10/10/2024',
  //     lastUpdated: '1 week ago' 
  //   },
  //   { 
  //     id: 5, 
  //     name: 'Logitech MX Master Mouse',
  //     status: 'Available',
  //     category: 'Accessories',
  //     serialNumber: 'LMX-8765-E',
  //     location: 'IT Store',
  //     condition: 'New',
  //     acquisitionDate: '25/02/2025',
  //     lastUpdated: '5 minutes ago' 
  //   },
  // ];

  // Filter options
  const filterOptions = ['All...', 'Available', 'Assigned', 'Maintenance', 'Reserved'];

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

  // Toggle expanded asset details
  const toggleAssetDetails = (assetId) => {
    if (expandedAssetId === assetId) {
      setExpandedAssetId(null);
    } else {
      setExpandedAssetId(assetId);
    }
  };

  // Handle asset request
  const handleAssetRequest = (assetId) => {
    // Implementation would go here
    console.log(`Requested asset ${assetId}`);
  };

  // Handle asset review
  const handleAssetReview = (assetId) => {
    // Implementation would go here
    console.log(`Reviewing asset ${assetId}`);
  };

  // Handle check availability
  const handleCheckAvailability = (assetId) => {
    // Implementation would go here
    console.log(`Checking availability for asset ${assetId}`);
  };

  // Filter assets based on search query and selected filter
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         asset.asset_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.asset_sn.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'All...' || asset.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#e8eac6" barStyle="dark-content" />
      
      {/* Header with Menu, Logo and Profile */}
      <View style={styles.header}>
        {/* <TouchableOpacity>
          <Feather name="menu" size={28} color="#333" />
        </TouchableOpacity> */}
        
        <View style={styles.logo}>
          <Image 
            source={images.Logo}
            style={styles.logoImage}
            // defaultSource={require('@/assets/images/placeholder.png')}
          />
        </View>
        
        {/* <View style={styles.notificationIcon}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
          <Ionicons name="person-circle-outline" size={32} color="#333" />
        </View> */}
      </View>

      {/* Assets Inventory section title */}
      <View style={styles.inventoryHeader}>
        <Text style={styles.sectionTitle}>Assets Inventory</Text>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterDropdown(!showFilterDropdown)}
        >
          <Text style={styles.filterButtonText}>{selectedFilter}</Text>
          <Feather name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Filter dropdown menu */}
      {showFilterDropdown && (
        <View style={styles.filterDropdownMenu}>
          {filterOptions.map((option) => (
            <TouchableOpacity 
              key={option} 
              style={styles.filterOption}
              onPress={() => {
                setSelectedFilter(option);
                setShowFilterDropdown(false);
              }}
            >
              <Text style={styles.filterOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Assets List */}
      <ScrollView style={styles.assetsContainer}>
        {filteredAssets.map((asset) => (
          <View key={asset.asset_id} style={styles.assetCard}>
            {/* Asset Card Header */}
            <View style={styles.assetCardHeader}>
              <View style={styles.assetNameContainer}>
                <Text style={styles.assetName}>{asset.asset_name}</Text>
                <View style={[styles.statusBadge, 
                  asset.status === 'Available' ? styles.statusAvailable : 
                  asset.status === 'Assigned' ? styles.statusAssigned :
                  asset.status === 'Maintenance' ? styles.statusMaintenance :
                  styles.statusReserved
                ]}>
                  <Text style={styles.statusText}>{asset.status}</Text>
                </View>
              </View>
              
              <TouchableOpacity onPress={() => toggleAssetDetails(asset.asset_id)}>
                <Feather 
                  name={expandedAssetId === asset.asset_id ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            
            {/* Summary Info Always Visible */}
            <View style={styles.assetSummary}>
              <View style={styles.assetInfoRow}>

                {/* <View style={styles.assetInfoItem}>
                  <Text style={styles.assetInfoLabel}>Category:</Text>
                  <Text style={styles.assetInfoValue}>{asset.asset_category}</Text>
                </View> */}

                <View style={styles.assetInfoItem}>
                  <Text style={styles.assetInfoLabel}>Serial No:</Text>
                  <Text style={styles.assetInfoValue}>{asset.asset_sn}</Text>
                </View>
              </View>
              <Text style={styles.assetLastUpdated}>Last updated: {asset.updated_at}</Text>
            </View>
            
            {/* Expanded Details and Actions */}
            {expandedAssetId === asset.asset_id && (
              <View style={styles.expandedContent}>
                <View style={styles.divider} />
                
                {/* Additional Details */}
                <View style={styles.expandedDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Location:</Text>
                      <Text style={styles.detailValue}>{asset.location}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Condition:</Text>
                      <Text style={styles.detailValue}>{asset.condition}</Text>
                    </View>
                  </View>
                  {/* <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Acquisition Date:</Text>
                      <Text style={styles.detailValue}>{asset.acquisitionDate}</Text>
                    </View>
                  </View> */}
                </View>
                
                <View style={styles.divider} />
                
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleAssetReview(asset.asset_id)}
                  >
                    <Feather name="eye" size={16} color="#333" />
                    <Text style={styles.actionButtonText}>Review</Text>
                  </TouchableOpacity>
                  
                  {asset.status === 'Available' && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.requestButton]}
                      onPress={() => handleAssetRequest(asset.asset_id)}
                    >
                      <Feather name="shopping-cart" size={16} color="#fff" />
                      <Text style={[styles.actionButtonText, styles.requestButtonText]}>Request Asset</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleCheckAvailability(asset.asset_id)}
                  >
                    <Feather name="calendar" size={16} color="#333" />
                    <Text style={styles.actionButtonText}>Check Availability</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  inventoryHeader: {
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
  searchFilterContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  filterDropdownMenu: {
    position: 'absolute',
    top: 155,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },
  assetsContainer: {
    marginHorizontal: 20,
    flex: 1,
  },
  assetCard: {
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
  assetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetNameContainer: {
    flex: 1,
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusAvailable: {
    backgroundColor: '#e6f7e6',
  },
  statusAssigned: {
    backgroundColor: '#e6e6ff',
  },
  statusMaintenance: {
    backgroundColor: '#fff0e6',
  },
  statusReserved: {
    backgroundColor: '#f7f7e6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  assetSummary: {
    marginTop: 5,
  },
  assetInfoRow: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  assetInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetInfoLabel: {
    fontSize: 14,
    color: '#888',
    marginRight: 5,
  },
  assetInfoValue: {
    fontSize: 14,
    color: '#333',
  },
  assetLastUpdated: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  expandedContent: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  expandedDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 5,
  },
  requestButton: {
    backgroundColor: '#0d1a31',
  },
  requestButtonText: {
    color: '#fff',
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