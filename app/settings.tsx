import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  About: { objID: number; information: string };
  Contact: { objID: number; information: string };
  Settings: { objID: number; information: string };
};

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Settings"
>;

export default function Settings() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const route = useRoute();
  const { objID, information } = (route.params as any) || {}; // Getting parameters

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>NUSTATYMAI</Text>
      <Text style={styles.text}>Čia yra nustatymų puslapis!</Text>
      <Text style={styles.text}>Galite keisti programėlės nustatymus.</Text>

      {/* GAUTI PARAMETRAI */}
      <Text style={styles.paramText}>Obj ID: {objID}</Text>
      <Text style={styles.paramText}>Information: {information}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>GRĮŽTI ATGAL</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Į PRADINĮ</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  paramText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "green",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
