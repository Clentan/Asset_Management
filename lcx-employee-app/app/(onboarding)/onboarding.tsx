import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";

import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import logo from "../../assets/images/lcx-logo.png";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      id: 1,
      title: "Welcome to Asset Tracker",
      description:
        "Manage your company assets easily! Request, track, and report issues related to the assets you use every day.",
    },
    {
      id: 2,
      title: "Request Assets",
      description:
        "Need an asset? Easily request the equipment or materials you need with just a few taps.",
    },
    {
      id: 3,
      title: "Track Your Assets",
      description:
        "Keep track of the assets assigned to you. Monitor the status, location, and condition of your equipment.",
    },
    {
      id: 4,
      title: "Report Asset Issues",
      description:
        "Report any issues or damages to assets directly from the app. Help us keep everything in top condition.",
    },
    {
      id: 5,
      title: "Stay Informed",
      description:
        "Get real-time updates about asset status, approval of your requests, and any issues related to your assets.",
    },
  ];

  const handleScroll = (event) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem("onboardingComplete", "true");
    router.push("/(auth)/Auth"); // Navigate to login after completing onboarding
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
      >
        {pages.map((page) => (
          <View key={page.id} style={[styles.page, { width }]}>
            <View style={styles.iconLogo}>              
              {/* <Image src={logo} /> */}
              <Text>Limpopo Connexion</Text>
            </View>
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.description}>{page.description}</Text>
          </View>
        ))}
      </ScrollView>
      <Button
        title={currentPage === pages.length - 1 ? "Get Started" : "Next"}
        onPress={() =>
          currentPage === pages.length - 1
            ? completeOnboarding()
            : setCurrentPage((prev) => prev + 1)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconLogo: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6200ea", // Use a brand color for the logo text
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333", // Dark color for the title text
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#555", // Lighter color for description text
    marginBottom: 20,
  },
});
