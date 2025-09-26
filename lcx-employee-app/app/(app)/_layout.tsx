import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Notification, User, Home2, ClipboardText, Note } from "iconsax-react-native";
import { router } from "expo-router";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{drawerActiveBackgroundColor:"#f5f7e8", drawerInactiveBackgroundColor:"#fff"}}>
        <Drawer.Screen
          name="Dashboard"
          options={{
            title: "",
            drawerLabel: () => (
              <View style={styles.drawerLabel}>
                <Home2 size="24" color="#000" />
                <Text style={styles.drawerLabelText}>Dashboard</Text>
              </View>
            ),
            headerStyle: { backgroundColor: "white", height: 100 },
            headerTintColor: "#000",
            headerShadowVisible: false,
            headerRight: () => (
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push("/Notifications")}>
                  <View>
                    <Notification size="24" color="#000" style={styles.iconSpacing} />
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>3</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("User clicked")}>
                  <User size="24" color="#000" />
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="AssetsInventory"
          options={{
            title: "",
            drawerLabel: () => (
              <View style={styles.drawerLabel}>
                <ClipboardText size="24" color="#000" />
                <Text style={styles.drawerLabelText}>Assets / Inventory</Text>
              </View>
            ),
            headerStyle: { backgroundColor: "white", height: 100 },
            headerTintColor: "#000",
            headerShadowVisible: false,
            headerRight: () => (
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push("/(app)/Notifications")}>
                  <View>
                    <Notification size="24" color="#000" style={styles.iconSpacing} />
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>3</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("User clicked")}>
                  <User size="24" color="#000" />
                </TouchableOpacity>
              </View>
            )
          }}
        />

        <Drawer.Screen
          name="RequestAsset"
          options={{
            title: "",
            drawerLabel: () => (
              <View style={styles.drawerLabel}>
                <Note size="24" color="#000" />
                <Text style={styles.drawerLabelText}>Request Asset</Text>
              </View>
            ),
            headerStyle: { backgroundColor: "white", height: 100 },
            headerTintColor: "#000",
            headerShadowVisible: false,
            headerRight: () => (
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push("/Notifications")}>
                  <View>
                    <Notification size="24" color="#000" style={styles.iconSpacing} />
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>3</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("User clicked")}>
                  <User size="24" color="#000" />
                </TouchableOpacity>
              </View>
            )
          }}
        />

        <Drawer.Screen
          name="Profile"
          options={{
            title: "",
            drawerLabel: () => (
              <View style={styles.drawerLabel}>
                <User size="24" color="#000" />
                <Text style={styles.drawerLabelText}>Profile</Text>
              </View>
            ),
            headerStyle: { backgroundColor: "white", height: 100 },
            headerTintColor: "#000",
            headerShadowVisible: false,
            headerRight: () => (
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push("/Notifications")}>
                  <View>
                    <Notification size="24" color="#000" style={styles.iconSpacing} />
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>3</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }}
        />

        <Drawer.Screen
          name="Notifications"
          options={{
            title: "",
            drawerLabel: () => (
              <View style={styles.drawerLabel}>
                <Notification size="24" color="#000" />
                <Text style={styles.drawerLabelText}>Notifications</Text>
              </View>
            ),
            headerStyle: { backgroundColor: "white", height: 100 },
            headerTintColor: "#000",
            headerShadowVisible: false,
            headerRight: () => (
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => console.log("User clicked")}>
                  <User size="24" color="#000" />
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  drawerLabelText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  iconSpacing: {
    marginRight: 15,
  },
  badge: {
    position: "absolute",
    top: -5,
    right:5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
