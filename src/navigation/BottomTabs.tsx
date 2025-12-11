import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProductsScreen from "../screens/ProductsScreen";
import AddScreen from "../screens/AddScreen";
import RemoveScreen from "../screens/RemoveScreen";
import DepartedScreen from "../screens/DepartedScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Remove" component={RemoveScreen} />
      <Tab.Screen name="Departed" component={DepartedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
