import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Profilis</Text>
        <Text style={styles.text}>Vartotojo vardas: {user?.displayName}</Text>
        <Text style={styles.text}>Vartotojo ID: {user?.uid}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  text: { fontSize: 18, marginBottom: 8 },
});
