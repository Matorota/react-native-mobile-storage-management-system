import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  About: { objID: number; information: string };
  Contact: { objID: number; information: string };
  Settings: { objID: number; information: string };
};

type AboutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "About"
>;

export default function About() {
  const navigation = useNavigation<AboutScreenNavigationProp>();
  const route = useRoute();
  const { objID, information } = (route.params as any) || {}; // Getting parameters with any type
  const [rotateAnim] = useState(new Animated.Value(0)); // Sukimosi animacija

  const suktiAnimacija = () => {
    // SUKIMOSI ANIMACIJA
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Grąžiname į pradinę poziciją
      rotateAnim.setValue(0);
    });
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ABOUT PUSLAPIS</Text>
      <Text style={styles.text}>Čia yra about puslapis!</Text>

      {/* GAUTI PARAMETRAI */}
      <Text style={styles.paramText}>Obj ID: {objID}</Text>
      <Text style={styles.paramText}>Information: {information}</Text>

      {/* ANIMUOTAS TEKSTAS */}
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <TouchableOpacity style={styles.animButton} onPress={suktiAnimacija}>
          <Text style={styles.animText}>🔄 SUKSIS!</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>GRĮŽTI ATGAL</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Contact", {
            objID: 2,
            information: "Kontaktų informacija",
          })
        }
      >
        <Text style={styles.buttonText}>EITI Į CONTACT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
  },
  paramText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "blue",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "orange",
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
  animButton: {
    backgroundColor: "purple",
    padding: 20,
    borderRadius: 50,
    marginVertical: 20,
    alignItems: "center",
  },
  animText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
