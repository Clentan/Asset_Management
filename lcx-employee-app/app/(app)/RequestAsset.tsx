import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { ArrowDown2, SearchNormal1 } from "iconsax-react-native";
import { useAssets } from '@/context/AssetContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const RequestAssets = () => {
  const { assets, requestAsset } = useAssets();

  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [returnDate, setReturnDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    // Initialize filtered assets with all available assets
    setFilteredAssets(assets);
  }, [assets]);

  const handleInputChange = (field, value) => {
    switch (field) {
      case "search":
        setSearch(value);
        filterAssets(value);
        break;
      case "purpose":
        setPurpose(value);
        break;
      default:
        break;
    }
  };

  const filterAssets = (searchText) => {
    const filtered = assets.filter((asset) =>
      asset.asset_name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredAssets(filtered);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setReturnDate(selectedDate);
      setDuration(selectedDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const validateForm = () => {
    if (!selectedAsset) {
      Alert.alert("Error", "Please select an asset");
      return false;
    }
    if (!purpose.trim()) {
      Alert.alert("Error", "Please enter a purpose");
      return false;
    }
    if (!duration.trim()) {
      Alert.alert("Error", "Please select a return date");
      return false;
    }
    return true;
  };

  const submitRequest = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await requestAsset(selectedAsset.asset_id, purpose, duration);
      Alert.alert(
        "Success",
        "Your asset request has been submitted successfully",
        [{ text: "OK", onPress: () => router.push("/AssetsInventory") }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#f5f8dc] flex-1">
      <ScrollView>
        <View className="flex-1 px-4 pb-8 bg-white rounded-3xl mx-4 my-4 relative">
          <View className="flex-row justify-center items-center pt-4 pb-6">
            <Image source={images.Logo} resizeMode="contain" className="w-[170px] h-[100px]" />
          </View>

          <Text className="text-xl font-bold mb-4">Request Asset</Text>

          {/* Asset selection */}
          <View className="mb-6">
            <Text className="text-sm font-medium mb-2">Select Asset</Text>
            <TouchableOpacity 
              onPress={() => setDropdownVisible(!dropdownVisible)}
              className="border border-gray-300 rounded-lg flex-row justify-between items-center px-4 py-3"
            >
              <Text className="text-base">
                {selectedAsset ? selectedAsset.asset_name : "Select an asset"}
              </Text>
              <ArrowDown2 size="20" color="#333" />
            </TouchableOpacity>

            {dropdownVisible && (
              <View className="mt-2 border border-gray-300 rounded-lg max-h-60 overflow-hidden">
                <View className="border-b border-gray-200 p-2">
                  <View className="flex-row items-center bg-gray-100 rounded-md px-2">
                    <SearchNormal1 size="18" color="#666" />
                    <TextInput
                      className="flex-1 h-10 ml-2"
                      placeholder="Search assets"
                      value={search}
                      onChangeText={(text) => handleInputChange("search", text)}
                    />
                  </View>
                </View>
                
                <ScrollView className="max-h-44">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <TouchableOpacity
                        key={asset.asset_id}
                        className="px-4 py-3 border-b border-gray-200"
                        onPress={() => {
                          setSelectedAsset(asset);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text className="font-medium">{asset.asset_name}</Text>
                        <Text className="text-sm text-gray-500">{asset.asset_code}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text className="text-center py-4 text-gray-500">No assets found</Text>
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Purpose field */}
          <View className="mb-6">
            <FormField
              title="Purpose"
              value={purpose}
              handleChangeText={(text) => handleInputChange("purpose", text)}
              placeholder="Why do you need this asset?"
            />
          </View>

          {/* Duration/Return Date field */}
          <View className="mb-6">
            <Text className="text-sm font-medium mb-2">Expected Return Date</Text>
            <TouchableOpacity 
              onPress={showDatePickerModal}
              className="border border-gray-300 rounded-lg p-3"
            >
              <Text>{duration || "Select a return date"}</Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={returnDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* Submit Button */}
          <CustomButton
            title="Submit Request"
            handlePress={submitRequest}
            containerStyles={isSubmitting ? "bg-gray-400" : "bg-blue-500"}
            textStyles="text-white font-bold"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestAssets;