import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "./global.css";

// Import screens
import HomeScreen from "./index";
import AboutScreen from "./about";
import ContactScreen from "./contact";
import SettingsScreen from "./settings";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Pagrindinis puslapis" }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: "Apie mus" }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{ title: "Kontaktai" }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Nustatymai" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
