import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";
import ProductsScreen from "../screens/ProductsScreen";
import AddScreen from "../screens/AddScreen";
import RemoveScreen from "../screens/RemoveScreen";
import DepartedScreen from "../screens/DepartedScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const BoxIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconBox, { borderColor: color }]}>
    <View style={[styles.iconInner, { backgroundColor: color }]} />
  </View>
);

const PlusIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    <View style={[styles.plusVertical, { backgroundColor: color }]} />
    <View style={[styles.plusHorizontal, { backgroundColor: color }]} />
  </View>
);

const MinusIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    <View style={[styles.minusLine, { backgroundColor: color }]} />
  </View>
);

const TruckIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    <View style={[styles.truckBody, { borderColor: color }]} />
    <View style={[styles.truckWheel, { backgroundColor: color }]} />
  </View>
);

const UserIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    <View style={[styles.userHead, { backgroundColor: color }]} />
    <View style={[styles.userBody, { borderColor: color }]} />
  </View>
);

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#218838",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarLabel: "Produktai",
          tabBarIcon: ({ color }) => <BoxIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          tabBarLabel: "Pridėti",
          tabBarIcon: ({ color }) => <PlusIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Remove"
        component={RemoveScreen}
        options={{
          tabBarLabel: "Išduoti",
          tabBarIcon: ({ color }) => <MinusIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Departed"
        component={DepartedScreen}
        options={{
          tabBarLabel: "Išvykę",
          tabBarIcon: ({ color }) => <TruckIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profilis",
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBox: {
    width: 24,
    height: 24,
    borderWidth: 2.5,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  iconInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  plusVertical: {
    width: 3,
    height: 20,
    position: "absolute",
  },
  plusHorizontal: {
    width: 20,
    height: 3,
    position: "absolute",
  },
  minusLine: {
    width: 20,
    height: 3,
  },
  truckBody: {
    width: 22,
    height: 14,
    borderWidth: 2.5,
    borderRadius: 3,
  },
  truckWheel: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: "absolute",
    bottom: 0,
    right: 3,
  },
  userHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    top: 0,
  },
  userBody: {
    width: 18,
    height: 12,
    borderWidth: 2.5,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    position: "absolute",
    bottom: 0,
  },
});
