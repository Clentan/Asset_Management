import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles = "", // Handle undefined otherStyles
  ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-texts font-semibold">{title}</Text>

      <View className={`w-full h-[50px] px-4 bg-white rounded-2xl ${isFocused ? 'border-primary border-2' : 'border-texts border'}`}>
        <TextInput
          className="flex-1 text-texts font-semibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="bg-texts"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />
      </View>
    </View>
  );
};

export default FormField;
