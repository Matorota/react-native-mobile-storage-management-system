import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./context/AuthContext";
import BottomTabs from "./navigation/BottomTabs";
import AuthScreen from "./screens/AuthScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import "./global.css";

const Stack = createNativeStackNavigator();

function MainNavigator() {
  const { user } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={BottomTabs} />
      )}
    </Stack.Navigator>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
