import React, { useState, useContext } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { ArrowDown2, SearchNormal1 } from "iconsax-react-native";
import { useAssets } from '@/context/AssetContext';

const RequestAssets = () => {
  const { assets, requestAsset } = useAssets();

  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState(assets);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleInputChange = (field, value) => {
    switch (field) {
      case "search":
        setSearch(value);
        filterAssets(value);
        break;
      case "purpose":
        setPurpose(value);
        break;
      case "duration":
        setDuration(value);
        break;
      default:
        break;
    }
  };

  const filterAssets = (searchText) => {
    const filtered = assets.filter((asset) =>
      asset.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredAssets(filtered);
  };

  const submitRequest = async () => {
    if (!selectedAsset) return alert("Please select an asset");
    setIsSubmitting(true);

    try 
    {
        await requestAsset(selectedAsset.asset_id, purpose, duration);
        // router.push("/success");
    } 
    catch (error) { alert("Failed to submit request"); } 
    finally { setIsSubmitting(false);  }     
  
  };

  return (
    <SafeAreaView className="bg-[#f5f8dc] flex-1">
      <ScrollView>
        <View className="flex-1 px-4 pb-8 bg-white rounded-3xl mx-4 my-4 relative">
          <View className="flex-row justify-center items-center pt-4 pb-6">
            <Image source={images.Logo} resizeMode="contain" className="w-[170px] h-[100px]" />
          </View>

          <View className="mb-6 border border-texts rounded-lg flex-row items-center px-4">
            <TextInput
              className="flex-1 h-12 text-base"
              placeholder="Search"
              value={search}
              onChangeText={(text) => handleInputChange("search", text)}
            />
            <TouchableOpacity className="ml-2" onPress={() => setDropdownVisible(!dropdownVisible)}>
              <SearchNormal1 size="24" color="#6666" />
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-bold mb-4">Request details</Text>

          <View className="mb-6">
            <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
              <View className="border border-gray-300 rounded-lg flex-row justify-between items-center px-4 py-2">
                <Text className="text-sm text-texts">
                  {selectedAsset ? selectedAsset.asset_name : "Select an asset"}
                </Text>
                <ArrowDown2 size="25" color="#333" />
              </View>
            </TouchableOpacity>

            {dropdownVisible && (
              <View className="mt-2 border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <TouchableOpacity
                      key={asset.asset_id}
                      className="px-4 py-2"
                      onPress={() => {
                        setSelectedAsset(asset);
                        setSearch(asset.asset_name);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text>{asset.asset_name}</Text>
                      <Text className="text-sm text-gray-500">{asset.asset_code}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text className="text-center text-gray-500">No results</Text>
                )}
              </View>
            )}
          </View>

          <FormField title="Purpose" value={purpose} handleChangeText={(text) => handleInputChange("purpose", text)} placeholder="Assignment" />
          <FormField title="Duration" value={duration} handleChangeText={(text) => handleInputChange("duration", text)} placeholder="Enter the date" />

          <CustomButton title="Submit Request" handlePress={submitRequest} containerStyles="bg-gray-300" isLoading={isSubmitting} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestAssets;
