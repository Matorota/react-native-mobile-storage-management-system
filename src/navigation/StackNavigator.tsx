import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductsScreen from "../screens/ProductsScreen";
import AddScreen from "../screens/AddScreen";
import RemoveScreen from "../screens/RemoveScreen";
import DepartedScreen from "../screens/DepartedScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Add" component={AddScreen} />
      <Stack.Screen name="Remove" component={RemoveScreen} />
      <Stack.Screen name="Departed" component={DepartedScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
